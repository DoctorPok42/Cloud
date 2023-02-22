import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";

export default async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var body = req.body;
  const { username, path, fileDataArray } = JSON.parse(body);

  const fileContentsArray = [] as any;
  for (let i = 0; i < fileDataArray.length; i++) {
    const { data } = fileDataArray[i];
    let fileContents;
    fileContents = Buffer.from(data.split(",")[1], "base64");
    fileContentsArray.push(fileContents);
  }

  const conn = new Client();
  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: any) {
        if (err) throw err;
        for (let i = 0; i < fileContentsArray.length; i++) {
          const fileContents = fileContentsArray[i];
          const fileName = fileDataArray[i].name;
          sftp.writeFile(
            path != null
              ? `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${path}/${fileName}`
              : `/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/${username}/${fileName}`,
            fileContents,
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
        }
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
