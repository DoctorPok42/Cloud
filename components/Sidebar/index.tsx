import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive,
  faUserGroup,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { Part } from "../../types/index";
import SidebarButton from "../SideBarButton";
import router from "next/router";

import styles from "./style.module.scss";

interface SidebarProps {
  page: Part;
  setPage: (page: Part) => void;
  loading: boolean;
  isReduced: boolean;
}

const Sidebar = ({
  page,
  setPage,
  loading,
  isReduced,
}: SidebarProps) => {
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
    <div className={styles.sidebar} style={{
      width: isReduced ? "3.5%" : "13.5%",
      transition: "width 0.3s ease-in-out",
      overflow: "hidden",
    }}>
      <div className={styles.logo}>
        <img
          src="/favicon.ico"
          alt="logo"
          style={{
            animation: loading
              ? "spin 1s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9)"
              : "",
          }}
        />
        {!isReduced && <h2>Cloud</h2>}
      </div>

      <SidebarButton
        name="my_drive"
        page={page}
        handlChangePart={handlChangePart}
        isReduced={isReduced}
      >
        <FontAwesomeIcon icon={faHardDrive} className={styles.sideicon} width={22} height={22} />
        {!isReduced && <h2>My drive</h2>}
      </SidebarButton>

      <SidebarButton
        name="shared_drive"
        page={page}
        handlChangePart={handlChangePart}
        isReduced={isReduced}
      >
        <FontAwesomeIcon icon={faUserGroup} className={styles.sideicon} width={22} height={22} />
        {!isReduced && <h2>Shared drive</h2>}
      </SidebarButton>

      <SidebarButton
        name="music"
        page={page}
        handlChangePart={handlChangePart}
        isReduced={isReduced}
      >
        <FontAwesomeIcon icon={faMusic} className={styles.sideicon} width={22} height={22} />
        {!isReduced && <h2>Music</h2>}
      </SidebarButton>
    </div>
  );
};

export default Sidebar;
