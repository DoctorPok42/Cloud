import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHardDrive, faUserGroup } from "@fortawesome/free-solid-svg-icons";

import { Part } from "../../types/index";
import styles from "./style.module.scss";
import SidebarButton from "../SideBarButton";

interface SidebarProps {
  page: Part;
  setPage: (page: Part) => void;
}

const Sidebar = ({ page, setPage }: SidebarProps) => {
  const handleChangePart = (part: Part, name: string) => {
    if (part === "my_drive" && name === "shared_drive") {
      setPage("shared_drive");
      window.location.href = "/shared";
    } else {
      setPage("my_drive");
      window.location.href = "/";
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
    </div>
  );
};

export default Sidebar;
