import { AvatarIcon, BreadCrumbs } from "../../components/";

import styles from "./style.module.scss";

interface HeaderProps {
  cookies: string;
  path: string;
  setPath: (path: string) => void;
}

const Header = ({
  cookies,
  path,
  setPath,
}: HeaderProps) => {
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1] as string;
  return (
    <div className={styles.bandeau}>
      <BreadCrumbs
        newPath={path}
        setNewPath={setPath}
      />

      <div className={styles.user}>
        <AvatarIcon username={username} />
      </div>
    </div>
  );
};

export default Header;
