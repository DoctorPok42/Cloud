import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh2";
import { verify_token } from "./functions";

const { SFTP_URL, SFTP_PORT, SFTP_PATH } = process.env;

export const config = {
  api: {
    responseLimit: false,
  },
};

const defTypes = {
  "application/json": ["json"],
  "text/plain": ["txt"],
  "text/markdown": ["md"],
  "text/csv": ["csv"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
  "application/zip": ["zip"],
  "application/octet-stream": ["bin"],
  "audio/mpeg": ["mp3"],
  "video/mp4": ["mp4"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
  "application/vnd.ms-excel": ["xls"],
  "application/vnd.ms-powerpoint": ["ppt"],
  "application/vnd.oasis.opendocument.text": ["odt"],
  "application/vnd.oasis.opendocument.spreadsheet": ["ods"],
  "application/vnd.oasis.opendocument.presentation": ["odp"],
  "application/x-7z-compressed": ["7z"],
  "application/x-rar-compressed": ["rar"],
  "application/x-tar": ["tar"],
  "application/x-gzip": ["gz"],
} as any;

export default async function getFile(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const token = req.cookies.token;
  const username = req.cookies.username;

  const verified = verify_token(token as string);
  if (!verified) {
    res.redirect(401, "/login");
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  if (!path || !username || !token) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const client = new Client();
  client.on("ready", () => {
    client.sftp((err, sftp) => {
      if (err) {
        return res.status(500).json({ message: "Failed to create SFTP session" });
      }

      sftp.stat(`${SFTP_PATH}/${username}/${path}`, (err, stats) => {
        if (err) {
          return res.status(500).json({ message: "Failed to retrieve file stats" });
        }

        if (stats.isFile()) {
          sftp.open(`${SFTP_PATH}/${username}/${path}`, "r", (err, handle) => {
            if (err) {
              return res.status(500).json({ message: "Failed to open file" });
            }

            const buffer = Buffer.alloc(stats.size);
            sftp.read(handle, buffer, 0, buffer.length, 0, (err: any) => {
              if (err) {
                return res.status(500).json({ message: "Failed to read file" });
              }

              const fileExt = (path as string).split(".").pop() ?? "";
              const contentType = Object.keys(defTypes).find((type) =>
                defTypes[type].includes(fileExt)
              ) ?? "application/octet-stream";

              const textTypes = ["text/plain", "text/markdown", "text/csv"];
              const isTextFile = textTypes.includes(contentType);

              if (isTextFile) {
                res.setHeader("Content-Type", contentType);
                return res.status(200).send(buffer.toString("utf-8"));
              }

              res.setHeader("Content-Type", contentType);
              // res.setHeader("Content-Disposition", `attachment; filename="${path}"`);
              res.setHeader("Content-Length", buffer.length.toString());

              res.setHeader("Cache-Control", "public, max-age=3600");
              // mettre du cache pour les fichiers
              res.setHeader("Expires", new Date(Date.now() + 3600 * 1000).toUTCString());
              res.setHeader("Last-Modified", new Date(stats.mtime).toUTCString());
              res.setHeader("Accept-Ranges", "bytes");
              res.end(buffer);
            });
          });
        } else {
          res.status(400).json({ message: "Path is not a file" });
        }
      });
    });
  });

  client.connect({
    host: SFTP_URL,
    port: SFTP_PORT as unknown as number,
    username: username,
    password: verified,
  });
}