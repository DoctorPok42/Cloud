import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.scss";
import DisplayFile from "./file";
import { Alert } from "@mui/material";

interface ContentProps {
  data: any;
  cookies: string;
  status: string;
  setStatus: (status: string) => void;
  path: string;
  newPath: string;
  setNewPath: (newPath: string) => void;
  loading: boolean;
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
  loading,
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

  return (
    <div className={styles.content}>
      {status != "" && (
        <Alert
          severity={status.split(":")[0] === "Error" ? "error" : "success"}
          className={styles.alert}
          onClose={() => {
            setStatus("");
          }}
        >
          {status}
        </Alert>
      )}
      {!isRacine() && (
        <div
          className={styles.folder__bis}
          onClick={() => {
            setNewPath(newPath.split("/").slice(0, -2).join("/") + "/");
          }}
        >
          <FontAwesomeIcon icon={faFolder} />
          <p className={styles.folder__name}>..</p>
        </div>
      )}
      {data.map((item: any) => {
        return (
          <>
            {item.longname[0] === "d" && (
              <div
                key={item.filename}
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
            />
          );
        }
      })}
    </div>
  );
};

export default Content;
