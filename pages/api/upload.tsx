import { NextApiRequest, NextApiResponse } from "next";
import { Client, SFTPWrapper } from "ssh2";
import { verify_token } from "./functions";

const { SFTP_URL, SFTP_PORT, SFTP_PATH } = process.env;

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "100gb",
    },
  },
}

export default async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const { username, token, path, fileDataArray } = JSON.parse(body);

  if (!username || !token || !fileDataArray) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const verified = verify_token(token);

  const fileContentsArray = [] as any;
  for (const { data } of fileDataArray) {
    let fileContents;
    fileContents = Buffer.from(data.split(",")[1], "base64");
    fileContentsArray.push(fileContents);
  }

  const conn = new Client();
  conn
    .on("ready", function () {
      conn.sftp(function (err: any, sftp: SFTPWrapper) {
        if (err) throw err;
        for (let i = 0; i < fileContentsArray.length; i++) {
          const fileContents = fileContentsArray[i];
          const fileName = fileDataArray[i].name;
          sftp.writeFile(
            path != null
              ? `${SFTP_PATH}/${path}/${fileName}`
              : `${SFTP_PATH}/${username}/${fileName}`,
            fileContents,
            { encoding: "utf8", flag: "w", mode: 0o644 },
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
      password: verified,
    });

  if (!SFTP_URL || !SFTP_PORT || !SFTP_PATH) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  res.status(200).json({ message: "Upload initiated" });
}
