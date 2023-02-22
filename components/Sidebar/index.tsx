import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive,
  faUserGroup,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";

import { Part } from "../../types/index";
import styles from "./style.module.scss";
import SidebarButton from "../SideBarButton";
import router from "next/router";

interface SidebarProps {
  page: Part;
  setPage: (page: Part) => void;
}

const Sidebar = ({ page, setPage }: SidebarProps) => {
  const handlChangePart = (name: string) => {
    switch (name) {
      case "my_drive":
        setPage("my_drive");
        router.push("/");
        break;
      case "shared_drive":
        setPage("shared_drive");
        router.push("/shared");
        break;
      case "music":
        setPage("music");
        router.push("/music");
        break;
    }
  };

  return (
    <div className={styles.sidebar}>
      <SidebarButton
        name="my_drive"
        page={page}
        handlChangePart={handlChangePart}
      >
        <FontAwesomeIcon icon={faHardDrive} className={styles.sideicon} />
        <h2>My drive</h2>
      </SidebarButton>

      <SidebarButton
        name="shared_drive"
        page={page}
        handlChangePart={handlChangePart}
      >
        <FontAwesomeIcon icon={faUserGroup} className={styles.sideicon} />
        <h2>Shared drive</h2>
      </SidebarButton>

      <SidebarButton name="music" page={page} handlChangePart={handlChangePart}>
        <FontAwesomeIcon icon={faMusic} className={styles.sideicon} />
        <h2>Music</h2>
      </SidebarButton>
    </div>
  );
};

export default Sidebar;
