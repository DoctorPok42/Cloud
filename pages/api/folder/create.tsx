import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";
import { verify_token } from "../functions";

export default function createFolder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const { username, token, path, folderName } = JSON.parse(body);

  if (!username || !token || !path || !folderName) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const verified = verify_token(token);

  if (!folderName) {
    res.status(400).json({ error: "Something went wrong" });
    return;
  }

  let uniqueFolder = true;

  if (folderName.includes("/"))
    uniqueFolder = false;

  let lastPath = folderName.split("/")[0];

  const conn = new Client();
  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        if (!uniqueFolder) {
          for (let i = 0; i < folderName.split("/").length; i++) {
            sftp.mkdir(
              `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${path}/${lastPath}`,
              function (err: any) {
                if (err) {
                  res.status(500).json({ error: "Something went wrong" });
                  conn.end();
                  return;
                } else {
                  res.status(200).json({ data: "Folder created" });
                }
                conn.end();
              }
              );
              lastPath += `/${folderName.split("/")[i + 1]}/`;
          }
        }
      });
    })
    .on("error", function () {
      res.status(500).json({ error: "Something went wrong" });
    })
    .connect({
      host: process.env.SFTP_URL,
      port: process.env.SFTP_PORT as unknown as number,
      username: username,
      password: verified,
    });
}
