import { SpeedDial, SpeedDialAction } from "@mui/material";
import { useState } from "react";
import styles from "./style.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive,
  faUserGroup,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";

interface UploadButtonProps {
  cookies: string;
  setStatus: (status: string) => void;
  setUpdate: (update: boolean) => void;
}

const UploadButton = ({ cookies, setStatus, setUpdate }: UploadButtonProps) => {
  const action = [
    {
      icon: <FontAwesomeIcon icon={faMusic} />,
      name: "Music",
      path: "Musique",
    },
    {
      icon: <FontAwesomeIcon icon={faUserGroup} />,
      name: "Shared drive",
      path: "Storage",
    },
    {
      icon: <FontAwesomeIcon icon={faHardDrive} />,
      name: "My drive",
      path: null,
    },
  ];

  const uploadFile = async (path: string | null) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.click();
    input.onchange = async (event: any) => {
      const files = event.target && event.target.files;
      if (!files || files === null) return null;
      const reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = async () => {
        const fileData = reader.result;

        const res = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify({
            username: cookies.split("=")[1],
            path: path,
            fileData: fileData,
            fileName: files[0].name,
            filesSize: files[0].size,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setStatus("Error: " + data.error);
        } else {
          setStatus("Success: File uploaded!");
          setUpdate(true);
        }
      };
    };
  };

  return (
    <div className={styles.uploadButton}>
      <SpeedDial
        ariaLabel="Upload a file"
        sx={{ position: "absolute", bottom: 0, right: 0 }}
        icon={<img src="/upload.png" />}
      >
        {action.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(e) => {
              uploadFile(action.path);
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default UploadButton;
