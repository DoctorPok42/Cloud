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
      className={styles.button}
      style={{
        backgroundColor: page === name ? "var(--blue)" : undefined,
      }}
      onClick={() => handlChangePart(name)}
    >
      {children}
    </a>
  );
};

export default SidebarButton;
