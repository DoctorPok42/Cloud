import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFileAudio,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.scss";

interface ContentProps {
  data: any;
}

const Content = ({ data }: ContentProps) => {
  return (
    <div className={styles.content}>
      {data.map((item: any) => {
        return (
          <>
            {item.longname[0] === "d" && (
              <div key={item.filename} className={styles.folder}>
                <FontAwesomeIcon icon={faFolder} />
                <p className={styles.folder__name}>
                  {item.filename.length > 20
                    ? item.filename.slice(0, 20) + "..."
                    : item.filename}
                </p>
              </div>
            )}
          </>
        );
      })}
      {data.map((item: any) => {
        return (
          <>
            {item.longname[0] === "-" && (
              <div key={item.filename} className={styles.field}>
                <FontAwesomeIcon
                  icon={
                    item.filename.slice(-4) === ".mp3" ||
                    item.filename.slice(-4) === ".flac" ||
                    item.filename.slice(-4) === ".wav" ||
                    item.filename.slice(-4) === ".ogg" ||
                    item.filename.slice(-4) === ".avi"
                      ? faFileAudio
                      : faFileLines
                  }
                  className={styles.field__icon}
                />
                <div className={styles.field__value}>
                  <p className={styles.field__name}>
                    {item.filename.slice(0, item.filename.lastIndexOf("."))}
                  </p>
                </div>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Content;
