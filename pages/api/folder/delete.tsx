import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";

export default function createFolder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const { path, folderName } = JSON.parse(body);

  if (!folderName) {
    res.status(400).json({ error: "Something went wrong" });
    return;
  }

  const conn = new Client();
  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        sftp.rmdir(
          `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${path}/${folderName}`,
          function (err: any) {
            if (err) {
              res.status(500).json({ error: "Something went wrong" });
              conn.end();
              return;
            } else {
              res.status(200).json({ data: "Folder deleted!" });
            }
            conn.end();
          }
        );
      });
    })
    .on("error", function () {
      res.status(500).json({ error: "Something went wrong" });
    })
    .connect({
      host: process.env.SFTP_URL,
      port: process.env.SFTP_PORT as unknown as number,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });
}
