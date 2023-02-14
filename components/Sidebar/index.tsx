import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive,
  faUserGroup,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";

import { Part } from "../../types/index";
import styles from "./style.module.scss";
import SidebarButton from "../SideBarButton";

interface SidebarProps {
  page: string;
  setPage: (page: Part) => void;
}

const Sidebar = ({ page, setPage }: SidebarProps) => {
  const handleChangePart = (name: string) => {
    switch (name) {
      case "my_drive":
        setPage("my_drive");
        window.location.href = "/";
        break;
      case "shared_drive":
        setPage("shared_drive");
        window.location.href = "/shared";
        break;
      case "music":
        setPage("music");
        window.location.href = "/music";
        break;
    }
  };

  return (
    <div className={styles.sidebar}>
      <SidebarButton
        name="my_drive"
        page={page}
        handleChangePart={handleChangePart}
      >
        <FontAwesomeIcon icon={faHardDrive} className={styles.sideicon} />
        <h2>My drive</h2>
      </SidebarButton>

      <SidebarButton
        name="shared_drive"
        page={page}
        handleChangePart={handleChangePart}
      >
        <FontAwesomeIcon icon={faUserGroup} className={styles.sideicon} />
        <h2>Shared drive</h2>
      </SidebarButton>

      <SidebarButton
        name="music"
        page={page}
        handleChangePart={handleChangePart}
      >
        <FontAwesomeIcon icon={faMusic} className={styles.sideicon} />
        <h2>Music</h2>
      </SidebarButton>
    </div>
  );
};

export default Sidebar;
