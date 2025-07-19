import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AvatarIcon, BreadCrumbs } from "../../components/";

import styles from "./style.module.scss";

interface HeaderProps {
  cookies: string;
  path: string;
  setPath: (path: string) => void;
  isReduced: boolean;
  setIsReduced: (isReduced: boolean) => void;
}

const Header = ({
  cookies,
  path,
  setPath,
  isReduced,
  setIsReduced,
}: HeaderProps) => {
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1] as string;
  return (
    <div className={styles.bandeau}>
      <FontAwesomeIcon
        icon={faCircleChevronLeft}
        className={styles.arrow}
        width={21.5}
        height={21.5}
        onClick={() => setIsReduced(!isReduced)}
        style={{
          transform: isReduced ? "rotate(-180deg)" : "rotate(0deg)",
        }}
      />

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
