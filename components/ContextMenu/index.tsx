import React from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import {
  faDownload,
  faInfoCircle,
  faLink,
  faPen,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './style.module.scss';

interface ContextMenuProps {
  x: number
  y: number
  e: any
  closeContextMenu: () => void
  file: any
  handleContextMenuAction: (action: string) => void
}

const ContextMenu = ({
  x,
  y,
  e,
  closeContextMenu,
  file,
  handleContextMenuAction,
}: ContextMenuProps) => {
  const ref = useClickAway(() => {
    closeContextMenu();
  }) as React.MutableRefObject<HTMLDivElement | null>;

  const menuButtons = [
    { name: "Infos", value: "infos", icon: faInfoCircle },
    { name: "Download", value: "download", icon: faDownload },
    { name: "Rename", value: "rename", icon: faPen },
    // { name: "Copy", value: "copy", icon: faCopy },
    // { name: "Move", value: "move", icon: faArrowCircleRight },
    // { name: "Pin", value: "pin", icon: faThumbTack },
    { name: "Share", value: "share", icon: faLink },
    // { name: "View", value: "view", icon: faEye },
    { name: "Delete", value: "delete", icon: faTrash, color: true }
  ]

  const handleAction = (action: string) => {
    handleContextMenuAction(action);
    closeContextMenu();
  }

  return (
    <div
      ref={ref}
      id="contextMenuChat"
      className={styles.ContextMenu_container}
      onContextMenu={(e) => {e.preventDefault()}}
      style={{
        top: `${y - 1}px`,
        left: `${x - 80}px`,
      }}
    >
      <div className={styles.ContextMenu_content}>
        {menuButtons.map((button, index) => (
          <div
            key={button.name + index}
            className={styles.ContextMenu_button}
            id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
            onClick={() => handleAction(button.value)}
          >
            <p
              id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
            >
              {button.name}
            {file.name}
            </p>
            <FontAwesomeIcon
              icon={button.icon}
              id={button.color ? styles.ContextMenu_button_red : styles.ContextMenu_button_blue}
              width={16}
              height={16}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextMenu;
