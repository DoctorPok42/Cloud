import { NextApiRequest, NextApiResponse } from "next";
import { Client, SFTPWrapper } from "ssh2";
import { connectToDatabase } from "../../utils/db";

const { SFTP_URL, SFTP_PORT, SFTP_PATH, SFTP_USERNAME, SFTP_PASSWORD } = process.env;

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function getSharedFiles(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.body;
  const conn = new Client();

  if (!code) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { db } = await connectToDatabase();
  const share = await db.collection("share").findOne({ uniqueId: code });
  if (!share) {
    return res.status(404).json({ error: "File not found" });
  }
  const { userId, itemId } = share;

  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: SFTPWrapper) {
        if (err) throw err;
        sftp.readFile(
            `${SFTP_PATH}/${userId}/${itemId}`,
            function (err: any, data: any) {
            if (err) {
              res.status(500).json({ error: "Something went wrong" });
              conn.end();
              return;
            } else {
              res.status(200).json({ data: data, name: itemId });
            }
            conn.end();
          }
        );
      });
    })
    .on("error", function (err: any) {
      if (err.message === "Error: No such file") {
        res.status(404).json({ error: "File not found" });
      } else {
        res.status(500).json({ error: "Something went wrong" });
      }
    })
      .connect({
        host: SFTP_URL,
        port: SFTP_PORT as unknown as number,
        username: SFTP_USERNAME,
        password: SFTP_PASSWORD,
      });
}
