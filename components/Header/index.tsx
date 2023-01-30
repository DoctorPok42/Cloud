import styles from "./style.module.scss";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className={styles.bandeau}>
      <img src="/favicon.ico" alt="logo" />
      <h2>{title}</h2>
    </div>
  );
};

export default Header;
