import React from 'react';

import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faFolder, faHardDrive } from '@fortawesome/free-solid-svg-icons';

interface DropPopupProps {
  folderHovered: string | null;
  path: string;
}

const DropPopup = ({
  folderHovered,
  path,
}: DropPopupProps) => {
  const formatName = (name: string | null) => {
    if (!name) return path.split("/").pop();

    if (name.length > 25) {
      return name.slice(0, 25) + "...";
    }
    return name;
  }

  return (
    <div className={styles.DropPopup_container}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={faCloudArrowUp} color='var(--blue)' size='3x' />
      </div>

      <div className={styles.title}>
        Déposer des fichier pour les importer dans
      </div>

      <div className={styles.folderName}>
        <FontAwesomeIcon icon={
          (path.includes("/") || folderHovered) ? faFolder : faHardDrive
        } /> {formatName(folderHovered)}
      </div>
    </div>
  );
};

export default DropPopup;
