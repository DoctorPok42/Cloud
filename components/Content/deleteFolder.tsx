interface ContentProps {
  cookies: string;
  setStatus: (status: string) => void;
  setNewPath: (newPath: string) => void;
  setLoading: (loading: boolean) => void;
}

const handlDeleteFolder = (
  path: string,
  { cookies, setStatus, setLoading, setNewPath }: ContentProps
) => {
  setLoading(true);
  setStatus("Deleting...");
  fetch("/api/folder/delete", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify({
      username: cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1],
      token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
      path: path,
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
        setNewPath(path.split("/").slice(0, -1).join("/"));
      }
    });
};

export default handlDeleteFolder;
