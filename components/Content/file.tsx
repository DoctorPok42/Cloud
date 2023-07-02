import { useState } from "react";
import styles from "./style.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setGoondIcon from "./setGoodIcon";
import { Menu } from "../../components";
import { Part } from "../../types";

interface FileProps {
  item: any;
  setStatus: (status: string) => void;
  cookies: string;
  path: string;
  setUpdate: (update: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const DisplayFile = ({
  item,
  setStatus,
  cookies,
  path,
  setUpdate,
  setLoading,
}: FileProps) => {
  const [menu, setMenu] = useState<boolean>(false);
  return (
    <div
      key={item.filename}
      className={styles.field}
      onClick={() => {
        setMenu(!menu);
      }}
    >
      <FontAwesomeIcon
        icon={setGoondIcon(item) as any}
        className={styles.field__icon}
      />
      <div className={styles.field__value}>
        <p className={styles.field__name}>
          {item.filename.length > 20
            ? item.filename.slice(0, 20) + "..."
            : item.filename}
        </p>
      </div>
      {menu && (
        <Menu
          setMenu={setMenu}
          setStatus={setStatus}
          cookies={cookies}
          filename={item.filename}
          fileSize={item.attrs.size}
          path={path}
          setUpdate={setUpdate}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default DisplayFile;
