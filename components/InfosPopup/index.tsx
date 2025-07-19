import React, { useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import setGoondIcon from '../Content/setGoodIcon';
import DisplayFile from '../Content/file';
import { faBan, faInfoCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface InfosPopupProps {
  infosFile: {
    filename: string;
    longname: string;
    attrs: {
      size: number;
      mtime: number;
      atime: number;
      owner: string;
    }
  }
  setInfosFile: (file: any) => void
  path: string;
  handleRenameFile: (fileName: string, newName: string, extension: string) => void;
}

const InfosPopup = ({
  infosFile,
  setInfosFile,
  path,
  handleRenameFile,
}: InfosPopupProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string>(infosFile.filename.split('.')[0]);
  const [zoom, setZoom] = useState<number>(40);

  const ref = useClickAway(() => {
    setInfosFile(null);
  }) as React.MutableRefObject<HTMLDivElement>;

  const inputRef = useClickAway(() => {
    setIsEditing(false);
    if (newValue !== infosFile.filename.split('.')[0] && newValue !== "") {
      const extension = infosFile.filename.split('.').pop();
      if (!extension) return;
      handleRenameFile(infosFile.filename, newValue, extension);
    }
  }) as React.MutableRefObject<HTMLInputElement>;

  return (
    <div className={styles.InfosPopup_container}>
      <div ref={ref} className={styles.InfosPopup_content}>
        <div className={styles.field__value}>
          <div className={styles.title}>
            <FontAwesomeIcon
              icon={setGoondIcon(infosFile)}
              color="#9ea7a8"
              width={15}
              height={15}
            />
            <p ref={inputRef} className={styles.field__name}>
              {isEditing ? (
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  className={styles.field__name__value}
                >
                  {newValue + "." + infosFile.filename.split('.').pop()}
                </span>
              )}
            </p>
          </div>

          <p>
            Last updated:{" "}
            {new Date(infosFile.attrs.mtime * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {infosFile.filename.split(".").pop() === "pdf" &&
         <div className={styles.zoom}>
          <button
            className={styles.zoom__button}
            onClick={() => {
              if (zoom > 40) setZoom(zoom - 10);
            }}
          >
            <FontAwesomeIcon
              icon={zoom > 40 ? faMinus : faBan}
              color="#9ea7a8"
              width={12}
              height={12}
            />
          </button>
          <button
            className={styles.zoom__button}
            onClick={() => {
              if (zoom < 90) setZoom(zoom + 10);
            }}
          >
            <FontAwesomeIcon
              icon={zoom < 90 ? faPlus : faBan}
              color="#9ea7a8"
              width={12}
              height={12}
            />
          </button>
        </div>}

        <DisplayFile
          item={infosFile}
          displayName={false}
          zoom={zoom}
          path={path.split('/').slice(1).join('/')}
          style={{
            width: "100%",
            height: "13em",
            margin: "0",
            marginTop: "1em",
            padding: "0",
            borderRadius: "8px",
            backgroundColor: "transparent",
          }}
        />

        <div className={styles.details}>
          <div className={styles.title}>
            <FontAwesomeIcon
              icon={faInfoCircle}
              color="#9ea7a8"
            />
            <p className={styles.field__name}>
              File Details
            </p>
          </div>

          <div className={styles.details__content}>
            <p>
              <span>Type:</span> <span>
              {infosFile.filename.split('.').pop()}
            </span>
            </p>
            <p>
              <span>Size:</span> <span>{
                infosFile.attrs.size > 1024 * 1024
                  ? `${(infosFile.attrs.size / (1024 * 1024)).toFixed(2)} MB`
                  : infosFile.attrs.size > 1024
                    ? `${(infosFile.attrs.size / 1024).toFixed(2)} KB`
                    : `${infosFile.attrs.size} Bytes`
              }</span>
            </p>
            <p>
              <span>Owner:</span> <span>
                {
                infosFile.longname.split(' ')[5] ? (<p><img alt={infosFile.longname.split(' ')[5]} src={`https://api.dicebear.com/7.x/adventurer-neutral/png?seed=${infosFile.longname.split(' ')[5]}&radius=50`} /> {infosFile.longname.split(' ')[5]}</p>) : "N/A"
                }
              </span>
            </p>
            <p>
              <span>Last Modified:</span> <span>{new Date(infosFile.attrs.mtime * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
            </p>
            <p>
              <span>Last Opened:</span> <span>{new Date(infosFile.attrs.atime * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
            </p>
            <p>
              <span>File Location:</span> <span>{path.split('/').join(' / ')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfosPopup;
