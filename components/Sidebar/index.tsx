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
  page: Part;
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
      case "musique":
        setPage("musique");
        window.location.href = "/musique";
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
        <FontAwesomeIcon icon={faHardDrive} className={styles.icon} />
        <h2>Mon drive</h2>
      </SidebarButton>

      <SidebarButton
        name="shared_drive"
        page={page}
        handleChangePart={handleChangePart}
      >
        <FontAwesomeIcon icon={faUserGroup} className={styles.icon} />
        <h2>Drive partagé</h2>
      </SidebarButton>

      <SidebarButton
        name="musique"
        page={page}
        handleChangePart={handleChangePart}
      >
        <FontAwesomeIcon icon={faMusic} className={styles.icon} />
        <h2>Musique</h2>
      </SidebarButton>
    </div>
  );
};

export default Sidebar;
