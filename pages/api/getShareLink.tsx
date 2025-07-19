import { NextApiRequest, NextApiResponse } from "next";
import { Client, SFTPWrapper } from "ssh2";
import { verify_token } from "./functions";
import { connectToDatabase } from "../../utils/db";

const { SFTP_URL, SFTP_PORT, SFTP_PATH } = process.env;

export default async function getShareLink(req: NextApiRequest, res: NextApiResponse) {
  const { userId, itemId, token } = req.body;

  if (!userId || !itemId || !token) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const conn = new Client();

  const verified = verify_token(token);
  if (!verified) {
    res.redirect(401, "/login");
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  // tester si le fichier existe
  const filename = itemId.split("/").pop() as string;
  const username = itemId.split("/")[0] as string;
  const path = itemId.split("/").slice(1, -1).join("/") ?? null;
  const newFileName = `${filename.split(".")[0]}_${userId}_share.${filename.split(".").pop()}`;

  conn
    .on("ready", () => {
      conn.sftp(function (err: any, sftp: SFTPWrapper) {
        if (err) throw err;
        sftp.readdir(`${SFTP_PATH}/${username}`, (err, list) => {
          if (err) throw err;
          const fileExists = list.some((file) => file.filename === filename);
          if (!fileExists) {
            return res.status(404).json({ error: "File not found" });
          }
        });
      });
    })
    .connect({
      host: SFTP_URL,
      port: parseInt(SFTP_PORT as string),
      username: username,
      password: token,
    });

  try {
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const { db } = await connectToDatabase()

    const existingShare = await db.collection("share").findOne({
      userId: userId,
      itemId: itemId,
    });

    if (existingShare) {
      return res.status(200).json({ code: existingShare.uniqueId });
    }

    await db.collection("share").insertOne({
      userId: userId,
      itemId: itemId,
      uniqueId: uniqueId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(200).json({ code: uniqueId });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
