import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';
import { useDropzone } from 'react-dropzone';

interface DropPopupProps {
  folderHovered: string | null;
  path: string;
  onDrop: (acceptedFiles: File[]) => void;
  setOnDrop: (onDrop: boolean) => void;
}

const DropPopup = ({
  folderHovered,
  path,
  onDrop,
  setOnDrop,
}: DropPopupProps) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className={styles.DropPopup_container}
      onDragLeave={(e) => {
        e.preventDefault();
        setOnDrop(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.title}>
          Upload and Attach files

          <div className={styles.icon} onClick={() => setOnDrop(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>

        <div className={styles.zone} {...getRootProps()}>
          <input {...getInputProps()} />

          <FontAwesomeIcon
            icon={faFolderOpen}
            className={styles.icon}
            size='2x'
            color='#eaeaea'
          />

          <p className={styles.zone__text}>
            Click to upload or drag and drop
          </p>

          <span>
            Maximum file size: 100GB
          </span>
        </div>
      </div>
    </div>
  );
};

export default DropPopup;
