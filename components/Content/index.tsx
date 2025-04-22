import React, { RefObject, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFolderMinus } from "@fortawesome/free-solid-svg-icons";
import DisplayFile from "./file";
import handlDeleteFolder from "./deleteFolder";
import { Alert, Snackbar } from "@mui/material";
import { UploadButton, AlertDialog, Header, ContextMenu, DropPopup, InfosPopup, SharePopup } from "../index";
import { deleteFile, downloadFile } from "../../utils/files";
import { useDropzone } from "react-dropzone";

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
  onDroped: boolean;
  mainRef: RefObject<HTMLDivElement>;
}

const initialContextMenu = {
  isOpen: false,
  x: 0,
  y: 0,
  e: null,
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
  onDroped,
  mainRef,
}: ContentProps) => {
  const [alertOpen, setAlertOpen] = useState<"file" | "folder" | null>(null);
  const [sharedOpen, setSharedOpen] = useState<boolean>(false);
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1];
  const [contextMenu, setContextMenu] = useState(initialContextMenu)
  const [fieldSelected, setFieldSelected] = useState<string | null>(null)
  const [folderHovered, setFolderHovered] = useState<string | null>(null)
  const [infosFile, setInfosFile] = useState<any>(null)

  const handleContextMenu = (e: any) => {
    e.preventDefault()

    const { pageX, pageY } = e

    let x = pageX - 170
    let y = pageY - 15

    if (window.innerWidth - pageX < 220) x = pageX - 230
    if (window.innerHeight - pageY < 270) y = pageY - 220

    setContextMenu({
      isOpen: true,
      x,
      y,
      e,
    })
  }

  const closeContextMenu = () => setContextMenu(initialContextMenu)

  const setGoogPath = () => {
    switch (newPath) {
      case "my_drive":
        return null;
      case "shared_drive":
      case "music":
        return "Musique";
      default:
        return newPath;
    }
  };

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
    setAlertOpen(null);
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

  const handleDeleteFile = () => {
    deleteFile(
      fieldSelected as string,
      setLoading,
      setStatus,
      setUpdate,
      setGoogPath,
      username,
      cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1]
    )
    handleConfirm()
  }

  const handleGoBack = () => {
    let relativePath = newPath.split("/").slice(0, -1).join("/");
    if (relativePath === "/") {
      relativePath = newPath.split("/")[0];
    }
    setNewPath(relativePath);
  }

  const handleRenameFile = async (filename: string, newFileName: string | null, fileExtension: string) => {
    if (!newFileName) return;

    setStatus(`Renaming ${filename} to ${newFileName}.${fileExtension}...`)

    const response = await fetch("/api/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
        filename,
        newFileName: newFileName + "." + fileExtension,
        newPath,
      }),
    })

    const data = await response.json();
    if (data.error) {
      setStatus("Error: " + data.error);
    } else {
      setStatus("Success: File renamed!");
      setUpdate(true);
    }
  }

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case "infos":
        setInfosFile([data.find((item: any) => item.filename === fieldSelected)])
        break;
      case "download":
        downloadFile(
          fieldSelected as string,
          setLoading,
          setStatus,
          setGoogPath,
          username,
          cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1]
        )
        break;
      case "rename":
        {
          const file = data.find((item: any) => item.filename === fieldSelected)
          const newName = prompt("Enter the new name", file.filename.split(".")[0])
          const fileExtension = file.filename.split(".")[1]
          handleRenameFile(file.filename, newName, fileExtension)
        }
        break;
      case "share":
        setSharedOpen(true)
        break;
      case "delete":
        setAlertOpen("file")
        break;
      default:
        break;
    }
  }

  const handleAddFiles = async (e: File[]) => {
    setStatus("Uploading...")
    for (const file of e) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        setStatus(`Uploading ${file.name.slice(0, 20)} ...`)
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify({
            username: cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1],
            token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
            path: newPath,
            fileDataArray: [{
              data: reader.result,
              name: file.name,
            }],
          })
        })

        const data = await response.json();

        if (data.error) {
          setStatus("Error: " + data.error);
          setLoading(false);
        } else {
          setStatus("Success: File uploaded!");
          setLoading(false);
          setUpdate(true);
        }
      }
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => handleAddFiles(acceptedFiles), []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className={styles.contentContainer}>
      <div className={styles.content}>
        {sharedOpen &&
          <SharePopup
            item={data?.find((item: any) => item.filename === fieldSelected)}
            userId={username}
            cookies={cookies}
            onClose={() => setSharedOpen(false)}
            setStatus={setStatus}
          />
        }

        {alertOpen &&
          <AlertDialog
            title={`Are you sure you want to delete this ${alertOpen}?`}
            content={`This action cannot be undone. This will permanently delete your ${alertOpen} and remove your data from the server.`}
            onClose={() => setAlertOpen(null)}
            onConfirm={() => alertOpen === "folder" ? handleConfirm() : handleDeleteFile()}
          />
        }

        {infosFile &&
          <InfosPopup
            infosFile={infosFile}
            setInfosFile={setInfosFile}
          />
        }

        <Header cookies={cookies} path={newPath} setPath={setNewPath} />

        {status !== "" && <Snackbar
          open={true}
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
        </Snackbar>}

        {contextMenu.isOpen &&
          <ContextMenu
            {...contextMenu}
            closeContextMenu={closeContextMenu}
            file={data.find((item: any) => item.filename === fieldSelected)}
            handleContextMenuAction={handleContextMenuAction}
          />
        }

        {data !== null &&
          <div
            {...getRootProps()}
            ref={mainRef}
            className={styles.lists}
            style={{
              backgroundColor: onDroped ? "var(--blue3)" : "",
              boxShadow: onDroped ? "0 0 0 2px var(--blue)" : "",
              zIndex: onDroped ? 1000 : 0,
            }}
          >
            {onDroped && <input {...getInputProps()} />}

            {onDroped &&
              <DropPopup
                folderHovered={folderHovered}
                path={newPath}
              />
            }

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
                  onClick={() => setAlertOpen("folder")}
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
                      onClick={(e) => {
                        if (e.detail === 2)
                          setNewPath(newPath + "/" + item.filename);
                      }}
                      onDragEnter={() => setFolderHovered(item.filename)}
                      onDragLeave={() => setFolderHovered(null)}
                    >
                      <FontAwesomeIcon icon={faFolder} color="var(--blue)" width={20} height={20} />
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
                  <div style={{
                    zIndex: !onDrop ? 1000000 : 1000,
                  }}>
                    <DisplayFile
                        item={item}
                        setStatus={setStatus}
                        cookies={cookies}
                        path={newPath}
                        setUpdate={setUpdate}
                        setLoading={setLoading}
                        handleContextMenu={handleContextMenu}
                        setFieldSelected={setFieldSelected}
                    />
                  </div>
                );
              }
            })}
          </div>
        }

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
