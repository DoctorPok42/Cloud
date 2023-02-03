import { AvatarIcon } from "../../components/";

import styles from "./style.module.scss";

interface HeaderProps {
  title: string;
  cookies: string;
}

const Header = ({ title, cookies }: HeaderProps) => {
  const username = cookies?.split("=")[1];
  return (
    <div className={styles.bandeau}>
      <div className={styles.logo}>
        <img src="/favicon.ico" alt="logo" />
        <h2>{title}</h2>
      </div>

      <div className={styles.user}>
        <AvatarIcon username={username} />
      </div>
    </div>
  );
};

export default Header;
