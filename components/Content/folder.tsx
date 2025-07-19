import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderClosed } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface DisplayFolderProps {
  item: {
    filename: string;
    attrs?: {
      mtime: number;
    };
    isServer?: boolean;
    onClick?: () => void;
  }
  icon?: {
    icon: any;
    color?: string;
  };
  setNewPath?: (newPath: string) => void;
  newPath?: string;
  setFolderHovered?: (folderHovered: string | null) => void;
  folderHovered?: string | null;
  handleContextMenu?: (e: React.MouseEvent, item: any) => void;
  setFieldSelected?: (fieldSelected: string) => void;
}

const DisplayFolder = ({ item, icon, setNewPath, newPath, setFolderHovered, folderHovered, handleContextMenu, setFieldSelected }: DisplayFolderProps) => {
  return (
    <div className={styles.folder} title={item.filename}>
      <div className={styles.folder_img}>
        <FontAwesomeIcon
          icon={icon?.icon ?? faFolderClosed}
          className={styles.icon}
          size='6x'
          color={icon?.color ?? '#3ba7f4'}
          onClick={(e) => {
            if (e.detail === 2) {
              if (item.isServer) {
                item.onClick?.();
              } else {
                setNewPath && setNewPath(newPath + "/" + item.filename);
              }
            }
          }}
          onMouseEnter={() => {
            setFolderHovered && setFolderHovered(item.filename);
          }}
          onMouseLeave={() => {
            setFolderHovered && setFolderHovered(null);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu && handleContextMenu(e, item);
          }}
        />
      </div>

       <div className={styles.folder_text}>
        <div className={styles.folder_name}>
          <h2>{item.filename}</h2>
        </div>

        {!item.isServer && <div className={styles.folder_update}>
          Last updated:{" "}
          {item.attrs?.mtime && new Date(item.attrs?.mtime * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>}
      </div>
    </div>
  );
};

export default DisplayFolder;
