import React from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import setGoondIcon from '../Content/setGoodIcon';

import styles from './style.module.scss';

interface InfosPopupProps {
  infosFile: {
    filename: string;
    longname: string;
    attrs: {
      size: number;
    }
  }[]
  setInfosFile: (file: any) => void
}

const InfosPopup = ({
  infosFile,
  setInfosFile,
}: InfosPopupProps) => {
  const ref = useClickAway(() => {
    setInfosFile(null);
  }) as React.MutableRefObject<HTMLDivElement>;

  const getTime = (date: string) => {
    return date.split(" ")[16] + " " + date.split(" ")[17] + " " + date.split(" ")[18];
  }

  return (
    <div className={styles.InfosPopup_container}>
      <div ref={ref} className={styles.InfosPopup_content}>
        {infosFile.map((file, index) => (
          <div key={index} className={styles.InfosPopup_file}>
            <div className={styles.icon}>
              <FontAwesomeIcon
                icon={setGoondIcon(file) as any}
                className={styles.field__icon}
              />
            </div>

            <div className={styles.text}>
              <p className={styles.InfosPopup_file__name}>Name: {file.filename}</p>
              <p className={styles.InfosPopup_file__infos}>
                <span>Size: {file.attrs.size < 1000
                  ? file.attrs.size + " octets"
                  : file.attrs.size < 1000000
                    ? (file.attrs.size / 1000).toFixed(2) + " Ko"
                    : file.attrs.size < 1000000000
                      ? (file.attrs.size / 1000000).toFixed(2) + " Mo"
                      : (file.attrs.size / 1000000000).toFixed(2) + " Go"}</span>
              </p>
              <p>Creation date: {getTime(file.longname)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfosPopup;
