import uploadFolder from "./uploadFolder";

interface UploadButtonProps {
  cookies: string;
  setStatus: (status: string) => void;
  setLoading: (loading: boolean) => void;
  newPath: string;
  setUpdate: (update: boolean) => void;
}

const uploadFile = async (
  path: string | null,
  { cookies, setStatus, setLoading, newPath, setUpdate }: UploadButtonProps
) => {
  if (path === "Folder") {
    uploadFolder({
      cookies,
      setStatus,
      setLoading,
      newPath,
      setUpdate,
    });
    return;
  }

  const files = document.createElement("input");
  files.setAttribute("multiple", "");
  files.setAttribute("type", "file");
  files.click();
  files.onchange = async () => {
    setLoading(true);
    setStatus("Uploading...");
    const fileDataArray = [] as any;
    if (files.files === null) {
      setStatus("Error: No files selected");
      setLoading(false);
      return;
    }
    for (let i = 0; i < files.files.length; i++) {
      const file = files.files[i];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const fileData = fileReader.result;
        fileDataArray.push({
          data: fileData,
          name: file.name,
        });
      };
    }

    while (fileDataArray.length < files.files.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify({
        username: cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1],
        token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
        path: path,
        fileDataArray: fileDataArray,
      }),
    });
    const data = await res.json();
    if (data.error) {
      setStatus("Error: " + data.error);
      setLoading(false);
    } else {
      setStatus("Success: File uploaded!");
      setLoading(false);
      setUpdate(true);
    }
  };
  setStatus("");
  setLoading(false);
};

export default uploadFile;
