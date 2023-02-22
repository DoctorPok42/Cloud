interface ContentProps {
  cookies: string;
  setStatus: (status: string) => void;
  setNewPath: (newPath: string) => void;
  setLoading: (loading: boolean) => void;
}

const handlDeleteFolder = (
  path: string,
  folderName: string,
  { cookies, setStatus, setLoading, setNewPath }: ContentProps
) => {
  const confirm = window.confirm(
    "Are you sure you want to delete this folder?"
  );
  if (!confirm) return;
  if (folderName === "") {
    setStatus("Error: Folder name is empty");
    return;
  }
  setLoading(true);
  setStatus("Deleting...");
  fetch("https://cloud.doctorpok.io/api/folder/delete", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify({
      username: cookies.split("=")[1],
      path: path,
      folderName: folderName,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        setStatus("Error: " + data.error);
        setLoading(false);
      } else {
        setStatus("Success: " + "Folder deleted!");
        setLoading(false);
        setNewPath(path);
      }
    });
};

export default handlDeleteFolder;
