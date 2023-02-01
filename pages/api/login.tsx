import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  const conn = new Client();
  const data = await new Promise((resolve, reject) => {
    conn
      .on("ready", function () {
        conn.sftp(function (err: any, sftp: any) {
          if (err) throw err;
          sftp.readdir(
            `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${body.username}`,
            function (err: any, list: any) {
              if (err) {
                res.status(500).json({ error: "Something went wrong" });
                conn.end();
                return;
              } else {
                res.status(200).json({ data: list });
              }
              resolve(list);
              conn.end();
            }
          );
        });
      })
      .connect({
        host: process.env.SFTP_URL,
        port: process.env.SFTP_PORT as unknown as number,
        username: body.password,
        password: body.password,
      });
  });
}
