import { Breadcrumbs } from "@mui/material";
import styles from "./style.module.scss";

interface BreadCrumbsProps {
  newPath: string;
  setNewPath: (newPath: string) => void;
}

const BreadCrumbs = ({
  newPath,
  setNewPath
}: BreadCrumbsProps) => {
  if (!newPath) return null;

  const handlFolder = (oldpath: string, newPath: string) => {
    const index = oldpath.indexOf(newPath);
    const newPath2 = oldpath.slice(0, index + newPath.length);
    setNewPath(newPath2);
  };

  return (
    <div className={styles.breadCrumbs}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        {newPath.split("/").map((item, index) => {
          if (item !== "") {
            return (
              <span
                key={index}
                onClick={() => {
                  handlFolder(newPath, item);
                }}
              >
                {item.length > 20 ? item.slice(0, 20) + "..." : item}
              </span>
            );
          }
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadCrumbs;
