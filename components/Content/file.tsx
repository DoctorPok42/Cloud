import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setGoondIcon from "./setGoodIcon";
import { Menu } from "../../components";

import styles from "./style.module.scss";

interface FileProps {
  item: any;
  setStatus: (status: string) => void;
  cookies: string;
  path: string;
  setUpdate: (update: boolean) => void;
  setLoading: (loading: boolean) => void;
  handleContextMenu: (e: any) => void;
  setFieldSelected: (field: string) => void;
}

const DisplayFile = ({
  item,
  setStatus,
  cookies,
  path,
  setUpdate,
  setLoading,
  handleContextMenu,
  setFieldSelected,
}: FileProps) => {
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <div
      key={item.filename}
      className={styles.field}
      onContextMenu={(e) => {
        handleContextMenu(e);
        setFieldSelected(item.filename);
      }}
    >
      <div className={styles.field__value}>
        <p className={styles.field__name}>
          {item.filename.length > 20
            ? item.filename.slice(0, 20) + "..."
            : item.filename}
        </p>
      </div>
      <FontAwesomeIcon
        icon={setGoondIcon(item) as any}
        className={styles.field__icon}
      />
      <div className={styles.field__date}>
        <p className={styles.field__date__text}>
          {item.longname.split(" ")[17] + " " + item.longname.split(" ")[19] + " " + item.longname.split(" ")[21]}
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
