import styles from "./style.module.scss";

interface SidebarButtonProps {
  name: string;
  page: string;
  handlChangePart: (name: string) => void;
  children: React.ReactNode;
  isReduced: boolean;
}

const SidebarButton = ({
  name,
  page,
  handlChangePart,
  children,
  isReduced,
}: SidebarButtonProps) => {
  return (
    <a
      className={styles.SidebarButton}
      onClick={() => handlChangePart(name)}
      style={{
        backgroundColor: page === name ? "#edf4ff" : "",
        width: isReduced ? "85%" : "95%",
      }}
    >
      {page === name && <div className={styles.active}></div>}
      {children}
    </a>
  );
};

export default SidebarButton;
