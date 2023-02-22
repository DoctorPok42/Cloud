import {
  faFileAudio,
  faFileLines,
  faFileCode,
  faFileVideo,
  faFileImage,
  faFileWord,
  faFilePdf,
  faFilePowerpoint,
  faFileCsv,
  faFile,
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
  const img = ["jpg", "png", "gif", "svg", "jpeg", "ico"];
  const doc = ["doc", "docx", "xls", "xlsx"];
  const pdf = ["pdf"];
  const ppt = ["ppt", "pptx"];
  const csv = ["csv"];

  if (
    filename === "undefined" ||
    filename === "null" ||
    filename === "" ||
    filename === " " ||
    extension === "undefined" ||
    extension === "null" ||
    extension === "" ||
    extension === " "
  ) {
    return faFile;
  }

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
  if (pdf.includes(extension)) {
    return faFilePdf;
  }
  if (ppt.includes(extension)) {
    return faFilePowerpoint;
  }
  if (csv.includes(extension)) {
    return faFileCsv;
  }
  return faFile;
};

export default setGoondIcon;
