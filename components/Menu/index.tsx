import { downloadFile, deleteFile } from "../../utils/files";

import styles from "./style.module.scss";

interface MenuProps {
  setMenu: (value: boolean) => void;
  setStatus: (value: string) => void;
  cookies: string;
  filename: string;
  fileSize: number;
  path: string;
  setUpdate: (update: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const Menu = ({
  setMenu,
  setStatus,
  cookies,
  filename,
  fileSize,
  path,
  setUpdate,
  setLoading,
}: MenuProps) => {
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1];
  const token = cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1];

  const setGoogPath = () => {
    switch (path) {
      case "my_drive":
        return null;
      case "shared_drive":
      case "music":
        return "Musique";
      default:
        return path;
    }
  };

  return (
    <div className={styles.menu}>
      <div
        className={styles.item}
        onClick={() => {
          downloadFile(
            filename,
            setLoading,
            setStatus,
            setGoogPath,
            username,
            token
          )
          setMenu(false);
        }}
      >
        <img src="/download.png" />
        <h2>Download</h2>
      </div>
      <div
        className={styles.item}
        onClick={() => {
          deleteFile(
            filename,
            setLoading,
            setStatus,
            setUpdate,
            setGoogPath,
            username,
            token
          )
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
