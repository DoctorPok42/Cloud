import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";

export default function uploadFile(req: NextApiRequest, res: NextApiResponse) {
  var body = req.body;
  const { username, path, fileData, fileName, filesSize } = JSON.parse(body);
  const conn = new Client();

  if (!fileName || !fileData) {
    res.status(400).json({ error: "Something went wrong" });
    return;
  }

  if (filesSize > 10000000) {
    res.status(400).json({ error: "File too large" });
    return;
  }

  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        sftp.writeFile(
          path != null
            ? `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${path}/${fileName}`
            : `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${username}/${fileName}`,
          fileData,
          function (err: any) {
            if (err) {
              res.status(500).json({ error: "Something went wrong" });
              conn.end();
              return;
            } else {
              res.status(200).json({ data: "File uploaded" });
            }
            conn.end();
          }
        );
      });
    })
    .on("error", function (err: any) {
      res.status(500).json({ error: "Something went wrong" });
    })
    .connect({
      host: process.env.SFTP_URL,
      port: process.env.SFTP_PORT as unknown as number,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });
}
