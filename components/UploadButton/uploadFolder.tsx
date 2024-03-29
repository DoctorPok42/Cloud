interface UploadButtonProps {
  cookies: string;
  setStatus: (status: string) => void;
  setLoading: (loading: boolean) => void;
  newPath: string;
  setUpdate: (update: boolean) => void;
}

const uploadFolder = async ({
  cookies,
  setStatus,
  setLoading,
  newPath,
  setUpdate,
}: UploadButtonProps) => {
  const folderName = prompt("Specify the name of the folder");
  if (folderName === null) return;
  setLoading(true);
  setStatus("Creating folder...");
  const res = await fetch("/api/folder/create", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify({
      username: cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1],
      token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
      path: newPath,
      folderName: folderName,
    }),
  });

  const data = await res.json();
  if (data.error) {
    setStatus("Error: " + data.error);
    setLoading(false);
  } else {
    setStatus("Success: Folder created!");
    setLoading(false);
    setUpdate(true);
  }
};

export default uploadFolder;
