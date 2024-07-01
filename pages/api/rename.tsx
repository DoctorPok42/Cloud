import { NextApiRequest, NextApiResponse } from "next";
import { Client, SFTPWrapper } from "ssh2";
import { verify_token } from "./functions";

const { SFTP_URL, SFTP_PORT, PATH } = process.env;

export default function renameFile(req: NextApiRequest, res: NextApiResponse) {
  const { username, token, filename, newFileName, path } = req.body;

  if (!username || !token || !filename || !newFileName) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const conn = new Client();

  const verified = verify_token(token);

  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: SFTPWrapper) {
        if (err) throw err;
        sftp.rename(
          path != null
            ? `${PATH}/${path}/${filename}`
            : `${PATH}/${username}/${filename}`,
          path != null
            ? `${PATH}/${path}/${newFileName}`
            : `${PATH}/${username}/${newFileName}`,
          function (err: any) {
            if (err) {
              res.status(500).json({ error: "Something went wrong" });
              conn.end();
              return;
            } else {
              res.status(200).json({ data: "File renamed!" });
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
