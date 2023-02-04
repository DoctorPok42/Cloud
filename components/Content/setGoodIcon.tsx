import {
  faFileAudio,
  faFileLines,
  faFileCode,
  faFileVideo,
  faFileImage,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";

interface ContentProps {
  filename: string;
}

const setGoondIcon = ({ filename }: ContentProps) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  const audio = ["mp3", "flac", "wav", "ogg", "avi"];
  const txt = ["txt", "md"];
  const code = ["html", "css", "js", "ts", "jsx", "tsx", "json"];
  const video = ["mp4", "mov", "avi"];
  const img = ["jpg", "png", "gif", "svg", "jpeg"];
  const doc = ["doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx"];

  if (audio.includes(extension)) {
    return faFileAudio;
  }
  if (txt.includes(extension)) {
    return faFileLines;
  }
  if (code.includes(extension)) {
    return faFileCode;
  }
  if (video.includes(extension)) {
    return faFileVideo;
  }
  if (img.includes(extension)) {
    return faFileImage;
  }
  if (doc.includes(extension)) {
    return faFileWord;
  }
};

export default setGoondIcon;
