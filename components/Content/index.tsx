import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFolderMinus } from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.scss";
import DisplayFile from "./file";
import handlDeleteFolder from "./deleteFolder";
import { Alert } from "@mui/material";
import { Part } from "../../types";

interface ContentProps {
  data: any;
  cookies: string;
  status: string;
  setStatus: (status: string) => void;
  path: Part;
  newPath: string;
  setNewPath: (newPath: string) => void;
  setLoading: (loading: boolean) => void;
  setUpdate: (update: boolean) => void;
}

const Content = ({
  data,
  cookies,
  status,
  setStatus,
  path,
  newPath,
  setNewPath,
  setLoading,
  setUpdate,
}: ContentProps) => {
  const username = cookies.split("=")[1];
  const isRacine = () => {
    if (newPath === username || newPath === username + "/") {
      return true;
    }
    if (newPath === "Storage" || newPath === "Storage/") {
      return true;
    }
    if (newPath === "Musique" || newPath === "Musique/") {
      return true;
    }
    return false;
  };

  const handlFolder = (folder: string) => {
    if (path === "my_drive") {
      setNewPath(username + "/" + folder + "/");
    }
    if (path === "shared_drive") {
      setNewPath("Storage/" + folder + "/");
    }
    if (path === "music") {
      setNewPath("Musique/" + folder + "/");
    }
  };

  const handlAlert = () => {
    switch (status.split(":")[0]) {
      case "Error":
        return "error";
      case "Success":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <div className={styles.content}>
      {status != "" && (
        <Alert
          severity={handlAlert()}
          className={styles.alert}
          onClose={() => {
            setStatus("");
          }}
        >
          {status}
        </Alert>
      )}
      {!isRacine() && (
        <>
          <div
            className={styles.folder__bis}
            onClick={() => {
              setNewPath(newPath.split("/").slice(0, -2).join("/") + "/");
            }}
          >
            <FontAwesomeIcon icon={faFolder} />
            <p className={styles.folder__name}>..</p>
          </div>
          <div
            className={styles.folder__delete}
            onClick={() => {
              handlDeleteFolder(
                newPath.split("/").slice(0, -2).join("/"),
                newPath.split("/").slice(-2)[0],
                {
                  cookies: cookies,
                  setStatus: setStatus,
                  setNewPath: setNewPath,
                  setLoading: setLoading,
                }
              );
            }}
          >
            <FontAwesomeIcon icon={faFolderMinus} />
            <p className={styles.folder__name}>Delete This Folder</p>
          </div>
        </>
      )}
      {data.map((item: any) => {
        return (
          <>
            {item.longname[0] === "d" && (
              <div
                // key={item.filename}
                className={styles.folder}
                onClick={() => {
                  handlFolder(item.filename);
                }}
              >
                <FontAwesomeIcon icon={faFolder} color="var(--blue)" />
                <p className={styles.folder__name}>
                  {item.filename.length > 20
                    ? item.filename.slice(0, 20) + "..."
                    : item.filename}
                </p>
              </div>
            )}
          </>
        );
      })}
      {data.map((item: any) => {
        if (item.longname[0] == "-") {
          return (
            <DisplayFile
              item={item}
              setStatus={setStatus}
              username={username}
              path={newPath}
              setUpdate={setUpdate}
              setLoading={setLoading}
            />
          );
        }
      })}
    </div>
  );
};

export default Content;
