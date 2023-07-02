import { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";
import { Client } from "ssh2";
import { createAuthToken } from "./functions";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  if (!body.username || !body.password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }
  const conn = new Client();
  const data = await new Promise((resolve, reject) => {
    conn
      .on("ready", function () {
        conn.sftp(function (err: any, sftp: any) {
          if (err) throw err;
          sftp.readdir(
            "/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/Storage",
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
        host: process.env.SFTP_URL,
        port: process.env.SFTP_PORT as unknown as number,
        username: body.username,
        password: body.password,
      });
  });
}
