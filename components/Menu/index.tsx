import styles from "./style.module.scss";
import { Part } from "../../types";

interface MenuProps {
  setMenu: (value: boolean) => void;
  setStatus: (value: string) => void;
  username: string;
  filename: string;
  fileSize: number;
  path: string;
  setUpdate: (update: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const Menu = ({
  setMenu,
  setStatus,
  username,
  filename,
  fileSize,
  path,
  setUpdate,
  setLoading,
}: MenuProps) => {
  const decodeType = (filename: string) => {
    const type = filename.lastIndexOf(".");
    switch (filename.substring(type + 1)) {
      case "mp3":
        return "audio/mpeg";
      case "avi":
        return "video/x-msvideo";
      case "mp4":
        return "video/mp4";
      case "jpg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "pdf":
        return "application/pdf";
      case "txt":
        return "text/plain";
      case "doc":
        return "application/msword";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "ppt":
        return "application/vnd.ms-powerpoint";
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "xls":
        return "application/vnd.ms-excel";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
  };

  const setGoogPath = () => {
    switch (path) {
      case "my_drive":
        return null;
      case "shared_drive":
        return "Storage";
      case "music":
        return "Musique";
      default:
        return path;
    }
  };

  const handlDownload = async () => {
    setLoading(true);
    setStatus("Downloading...");
    const res = await fetch(`/api/download/${filename}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: setGoogPath(),
        username: username,
      }),
    });
    const data = await res.json();
    if (data.error) {
      setStatus("Error:" + data.error);
      return;
    } else {
      const url = `data:${decodeType(filename)};base64,${Buffer.from(
        data.data.data
      ).toString("base64")}`;
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.addEventListener("load", () => {
        document.body.removeChild(link);
        setStatus("Success: File downloaded!");
      });
      link.click();
      setLoading(false);
      setStatus("Success: File downloaded!");
    }
  };

  const handlDelete = async (username: string, filename: string) => {
    const approb = confirm("Are you sure you want to delete this file ?");
    if (!approb) return;
    setLoading(true);
    setStatus("Deleting...");
    const res = await fetch(`/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        filename: filename,
        path: setGoogPath(),
      }),
    });
    const data = await res.json();
    if (data.error) {
      setStatus("Error:" + data.error) as any;
      setLoading(false);
    } else {
      setStatus("Success: File deleted!") as any;
      setLoading(false);
      setUpdate(true);
    }
  };

  return (
    <div className={styles.menu}>
      <div
        className={styles.item}
        onClick={() => {
          handlDownload();
          setMenu(false);
        }}
      >
        <img src="/download.png" />
        <h2>Download</h2>
      </div>
      <div
        className={styles.item}
        onClick={() => {
          handlDelete(username, filename);
          setMenu(false);
        }}
      >
        <img src="/delete.png" />
        <h2>Delete</h2>
      </div>
      <h4>
        {fileSize < 1000
          ? fileSize + " octets"
          : fileSize < 1000000
          ? (fileSize / 1000).toFixed(2) + " Ko"
          : fileSize < 1000000000
          ? (fileSize / 1000000).toFixed(2) + " Mo"
          : (fileSize / 1000000000).toFixed(2) + " Go"}
      </h4>
    </div>
  );
};

export default Menu;
