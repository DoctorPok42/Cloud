import { Part } from "../../types";
import styles from "./style.module.scss";

interface SidebarButtonProps {
  name: string;
  page: Part;
  handleChangePart: (part: Part, name: string) => void;
  children: React.ReactNode;
}

const SidebarButton = ({
  name,
  page,
  handleChangePart,
  children,
}: SidebarButtonProps) => {
  return (
    <a
      className={styles.button}
      style={{
        backgroundColor: page === name ? "var(--blue)" : undefined,
      }}
      onClick={() => handleChangePart(page, name)}
    >
      {children}
    </a>
  );
};

export default SidebarButton;
