import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setGoondIcon from "./setGoodIcon";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

import styles from "./style.module.scss";

interface FileProps {
  item: any;
  path: string;
  handleContextMenu?: (e: any) => void;
  setFieldSelected?: (field: string) => void;
  style?: React.CSSProperties;
  displayName?: boolean;
  zoom?: number;
}

const DisplayFile = ({
  item,
  path,
  handleContextMenu,
  setFieldSelected,
  style,
  displayName = true,
  zoom = 1,
}: FileProps) => {
  const [textPreview, setTextPreview] = useState("");

  const fileExt = item.filename.split(".").pop()?.toLowerCase() ?? "";
  const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg"].includes(fileExt);
  const isEmbeddable = [
    "pdf",
    "pptx",
    "odt",
    "ods",
    "odp",
  ].includes(fileExt);
  const isText = ["txt", "md", "csv"].includes(fileExt);

  useEffect(() => {
    if (isText) {
      fetch(`/api/getFile?path=${item.filename}`)
        .then((res) => res.text())
        .then((text) => setTextPreview(text))
        .catch(() => setTextPreview("Error loading preview"));
    }
  }, [item.filename]);

  useEffect(() => {}, [zoom])

  const iframeSrc = `/api/getFile?path=${encodeURIComponent(path + "/" + item.filename)}#toolbar=0&navpanes=0&scrollbar=0&zoom=${zoom}&view=${zoom > 1 ? "" : "FitH"}`;

  return (
    <div
      key={item.filename}
      className={styles.field}
      onContextMenu={(e) => {
        setFieldSelected && setFieldSelected(item.filename);
        handleContextMenu && handleContextMenu(e);
      }}
      style={{
        ...style,
      }}
    >
      <div className={styles.icon}>
        {isImage ? (
          <img
            src={`/api/getFile?path=${path + "/" + item.filename}`}
            alt={item.filename}
            className={styles.field__icon}
          />
        ) : isEmbeddable ? (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            width="80%"
            height="100%"
            style={{
              border: "none",
              borderRadius: "8px",
              marginTop: "1em",
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              setFieldSelected && setFieldSelected(item.filename);
              handleContextMenu && handleContextMenu(e);
            }}
          ></iframe>
        ) : isText ? (
          <pre className={styles.textPreview}>{textPreview}</pre>
        ) : (
          <FontAwesomeIcon
          icon={setGoondIcon(item) as any}
          className={styles.field__icon}
          width={50}
          height={50}
          color="#9ea7a8"
        />
        )}
      </div>

      {displayName && <div className={styles.field__value}>
        <div className={styles.title}>
          <FontAwesomeIcon
            icon={setGoondIcon(item)}
            color="#9ea7a8"
            width={10}
            height={10}
          />
          <p className={styles.field__name}>
            {item.filename}
          </p>

          <div className={styles.dot} onClick={(e) => {
            e.stopPropagation();
            setFieldSelected && setFieldSelected(item.filename);
            handleContextMenu && handleContextMenu(e);
          }}>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              color="#9ea7a8"
              width={4}
              height={4}
              style={{
                margin: "0"
              }}
            />
          </div>
        </div>

        <p>
          Last updated:{" "}
          {new Date(item.attrs.mtime * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>}
    </div>
  );
};

export default DisplayFile;
