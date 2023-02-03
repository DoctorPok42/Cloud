import { Part } from "../../types";
import styles from "./style.module.scss";

interface SidebarButtonProps {
  name: string;
  page: Part;
  handleChangePart: (name: string) => void;
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
      onClick={() => handleChangePart(name)}
    >
      {children}
    </a>
  );
};

export default SidebarButton;
