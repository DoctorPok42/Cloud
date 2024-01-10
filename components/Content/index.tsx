import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFolderMinus } from "@fortawesome/free-solid-svg-icons";
import DisplayFile from "./file";
import handlDeleteFolder from "./deleteFolder";
import { Alert, Snackbar } from "@mui/material";
import UploadButton from "../UploadButton";
import AlertDialog from "../AlertDialog";
import Header from "../Header";

import styles from "./style.module.scss";

interface ContentProps {
  data: any;
  cookies: string;
  status: string;
  setStatus: (status: string) => void;
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
  newPath,
  setNewPath,
  setLoading,
  setUpdate,
}: ContentProps) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1];

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

  const handleConfirm = () => {
    setAlertOpen(false);
    handlDeleteFolder(
      newPath,
      {
        cookies: cookies,
        setStatus: setStatus,
        setNewPath: setNewPath,
        setLoading: setLoading,
      }
    )
  }

  const handleGoBack = () => {
    let relativePath = newPath.split("/").slice(0, -1).join("/");
    if (relativePath === "/") {
      relativePath = newPath.split("/")[0];
    }
    setNewPath(relativePath);
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.content}>
      {alertOpen && <AlertDialog
        title="Are you sure you want to delete this folder?"
        content="This action cannot be undone. This will permanently delete your folder and remove your data from the server."
        onClose={() => setAlertOpen(false)}
        onConfirm={() => handleConfirm()}
        />}
        <Header cookies={cookies} path={newPath} setPath={setNewPath} />
        <Snackbar
          open={status !== ""}
          className={styles.alert}
          autoHideDuration={500}
          onClose={() => setStatus("")}
        >
          <Alert
            onClose={() => setStatus("")}
            severity={handlAlert()}
            className={styles.alert}
          >
            {status}
          </Alert>
        </Snackbar>
        {data !== null && <div className={styles.lists}>
          {!isRacine() && (
            <>
              <div
                className={styles.folder__bis}
                onClick={() => handleGoBack()}
              >
                <FontAwesomeIcon icon={faFolder} />
                <p className={styles.folder__name}>
                  ..
                </p>
              </div>

              <div
                className={styles.folder__delete}
                onClick={() => setAlertOpen(true)}
              >
                <FontAwesomeIcon icon={faFolderMinus} />
                <p className={styles.folder__name}>
                  Delete This Folder
                </p>
              </div>
            </>
          )}
          {data.map((item: any) => {
            return (
              <>
                {item.longname[0] === "d" && (
                  <div
                    key={item.filename}
                    className={styles.folder}
                    onClick={() => {
                      setNewPath(newPath + "/" + item.filename);
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
                  cookies={cookies}
                  path={newPath}
                  setUpdate={setUpdate}
                  setLoading={setLoading}
                />
              );
            }
          })}
        </div>}
        <UploadButton
          cookies={cookies}
          setStatus={setStatus}
          setLoading={setLoading}
          newPath={newPath}
          setUpdate={setUpdate}
        />
      </div>
    </div>
  );
};

export default Content;
