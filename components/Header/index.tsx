import { AvatarIcon } from "../../components/";

import styles from "./style.module.scss";

interface HeaderProps {
  title: string;
  cookies: string;
  loading: boolean;
}

const Header = ({ title, cookies, loading }: HeaderProps) => {
  const username = cookies?.split("=")[1];
  return (
    <div className={styles.bandeau}>
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
        <h2>{title}</h2>
      </div>

      <div className={styles.user}>
        <AvatarIcon username={username} />
      </div>
    </div>
  );
};

export default Header;
