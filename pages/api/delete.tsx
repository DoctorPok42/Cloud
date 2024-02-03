import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";
import { verify_token } from "./functions";

const { SFTP_URL, SFTP_PORT, PATH } = process.env;

export default function deleteFile(req: NextApiRequest, res: NextApiResponse) {
  const { username, token, filename, path } = req.body;

  if (!username || !token || !filename) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const conn = new Client();

  const verified = verify_token(token);

  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        sftp.unlink(
          path != null
            ? `${PATH}/${path}/${filename}`
            : `${PATH}/${username}/${filename}`,
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
      host: SFTP_URL,
      port: SFTP_PORT as unknown as number,
      username: username,
      password: verified,
    });
}
