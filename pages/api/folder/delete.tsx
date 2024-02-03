import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";
import { verify_token } from "../functions";

const { SFTP_URL, SFTP_PORT, PATH } = process.env;

export default function createFolder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const { username, token, path } = JSON.parse(body);

  if (!username || !token || !path) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const verified = verify_token(token);

  const conn = new Client();
  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        sftp.rmdir(
          `${PATH}/${path}`,
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
      host: SFTP_URL,
      port: SFTP_PORT as unknown as number,
      username: username,
      password: verified,
    });
}
