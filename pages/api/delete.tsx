import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";

export default function deleteFile(req: NextApiRequest, res: NextApiResponse) {
  const { username, filename, path } = req.body;
  const conn = new Client();

  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        sftp.unlink(
          path != null
            ? `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${path}/${filename}`
            : `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${username}/${filename}`,
          function (err: any) {
            if (err) {
              res.status(500).json({ error: "Something went wrong" });
              conn.end();
              return;
            } else {
              res.status(200).json({ data: "File deleted!" });
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
      host: process.env.SFTP_URL,
      port: process.env.SFTP_PORT as unknown as number,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });
}
