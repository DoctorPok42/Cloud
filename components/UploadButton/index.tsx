import { SpeedDial, SpeedDialAction } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive,
  faUserGroup,
  faMusic,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import uploadFile from "./uploadFile";

import styles from "./style.module.scss";

interface UploadButtonProps {
  cookies: string;
  setStatus: (status: string) => void;
  setLoading: (loading: boolean) => void;
  newPath: string;
  setUpdate: (update: boolean) => void;
}

const UploadButton = ({
  cookies,
  setStatus,
  setLoading,
  newPath,
  setUpdate,
}: UploadButtonProps) => {
  const action = [
    {
      icon: <FontAwesomeIcon icon={faFolderPlus} />,
      name: "Create folder here",
      path: "Folder",
    },
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

  return (
    <div className={styles.uploadButton}>
      <SpeedDial
        ariaLabel="Upload a file"
        sx={{ position: "absolute", bottom: 0, right: 0 }}
        icon={<img src="./upload.png" />}
      >
        {action.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              uploadFile(action.path, {
                cookies,
                setStatus,
                setLoading,
                newPath,
                setUpdate,
              });
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default UploadButton;
