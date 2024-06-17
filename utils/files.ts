const decodeType = (filename: string) => {
  const type = filename.lastIndexOf(".");
  switch (filename.substring(type + 1)) {
    case "mp3":
      return "audio/mpeg";
    case "avi":
      return "video/x-msvideo";
    case "mp4":
      return "video/mp4";
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "pdf":
      return "application/pdf";
    case "txt":
      return "text/plain";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
};

export const downloadFile = async (
  filename: string,
  setLoading: (value: boolean) => void,
  setStatus: (value: string) => void,
  setGoogPath: () => string | null,
  username: string | undefined,
  token: string | undefined
) => {
  setLoading(true);
  setStatus("Downloading...");

  const res = await fetch(`/api/download/${filename}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: setGoogPath(),
      username: username,
      token: token,
    }),
  });

  const data = await res.json();
  if (data.error) {
    setStatus("Error:" + data.error);
    return;
  } else {
    const url = `data:${decodeType(filename)};base64,${Buffer.from(
      data.data.data
    ).toString("base64")}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.addEventListener("load", () => {
      document.body.removeChild(link);
      setStatus("Success: File downloaded!");
    });
    link.click();
    setLoading(false);
    setStatus("Success: File downloaded!");
  }
};

export const deleteFile = async (
  filename: string,
  setLoading: (value: boolean) => void,
  setStatus: (value: string) => void,
  setUpdate: (value: boolean) => void,
  setGoogPath: () => string | null,
  username: string | undefined,
  token: string | undefined
) => {
  setLoading(true);
  setStatus("Deleting...");

  const res = await fetch(`/api/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      token: token,
      filename: filename,
      path: setGoogPath(),
    }),
  });

  const data = await res.json();
  if (data.error) {
    setStatus("Error:" + data.error) as any;
    setLoading(false);
  } else {
    setStatus("Success: File deleted!") as any;
    setLoading(false);
    setUpdate(true);
  }
};
