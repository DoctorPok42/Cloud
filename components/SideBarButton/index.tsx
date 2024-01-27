import styles from "./style.module.scss";

interface SidebarButtonProps {
  name: string;
  page: string;
  handlChangePart: (name: string) => void;
  children: React.ReactNode;
}

const SidebarButton = ({
  name,
  page,
  handlChangePart,
  children,
}: SidebarButtonProps) => {
  return (
    <a
      className={styles.SidebarButton}
      onClick={() => handlChangePart(name)}
    >
      {page === name && <div className={styles.active}></div>}
      {children}
    </a>
  );
};

export default SidebarButton;
