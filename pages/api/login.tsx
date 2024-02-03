import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";
import { createAuthToken } from "./functions";

const { SFTP_URL, SFTP_PORT, PATH } = process.env;

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  if (!body.username || !body.password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn
      .on("ready", function () {
        conn.sftp(function (err: any, sftp: any) {
          if (err) throw err;
          sftp.readdir(
            PATH,
            function (err: any, list: any) {
              if (err) {
                res.status(500).json({ error: "Something went wrong" });
                conn.end();
                return;
              } else {
                const token = createAuthToken(body.password);
                res.setHeader("Set-Cookie", [
                  `username=${body.username}; path=/; Max-Age=3600`,
                  `token=${token}; path=/; Max-Age=3600`,
                ]);
                res.status(200).json({ data: list });
              }
              resolve(list);
              conn.end();
            }
          );
        });
      })
      .on("error", function (err: any) {
        if (err.message === "All configured authentication methods failed") {
          res.status(401).json({ error: "Invalid username or password" });
        } else {
          res.status(500).json({ error: "Something went wrong" });
        }
      })
      .connect({
        host: SFTP_URL,
        port: SFTP_PORT as unknown as number,
        username: body.username,
        password: body.password,
      });
  });
}
