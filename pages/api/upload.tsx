import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";

const { SFTP_URL, SFTP_PORT, PATH } = process.env;

export default async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var body = req.body;
  const { username, token, path, fileDataArray } = JSON.parse(body);

  if (!username || !token || !fileDataArray) {
    return res.status(400).json({ error: "Missing parameters" });
  }

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
              ? `${PATH}/${path}/${fileName}`
              : `${PATH}/${username}/${fileName}`,
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
      host: SFTP_URL,
      port: SFTP_PORT as unknown as number,
      username: username,
      password: token,
    });
}
