import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import {
  Sidebar,
  Content,
} from "../components";
import { Part } from "../types/index";

interface SharedProps {
  cookies: string;
  isReduced: boolean;
  setIsReduced: (isReduced: boolean) => void;
}

export default function Shared({ cookies, isReduced, setIsReduced }: SharedProps) {
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1] as string;
  const [path, setPath] = useState<Part>("shared_drive");
  const [newPath, setNewPath] = useState<string>("Storage");
  const [status, setStatus] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [onDrop, setOnDrop] = useState<boolean>(false)

  const mainRef = useRef<any>(null)

  useEffect(() => {
    setLoading(true);
    fetch("/api/getFiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPath: newPath,
        username: username,
        token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setStatus("Error: " + data.error);
        } else {
          await setData(data.data);
        }
        setLoading(false);
        setUpdate(false);
      });
  }, [newPath, update]);

  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      console.log("")
      setOnDrop(true)
    }

    mainRef.current?.addEventListener("dragenter", onDragOver)
    mainRef.current?.addEventListener("dragstart", onDragOver)
    mainRef.current?.addEventListener("ondrop", onDragOver)

    return () => {
      mainRef.current?.removeEventListener("dragover", onDragOver)
      mainRef.current?.removeEventListener("dragstart", onDragOver)
      mainRef.current?.removeEventListener("ondrop", onDragOver)
    }
  }, [mainRef])

  return (
    <>
      <Head>
        <title>Cloud | Shared</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>
      <div className="container">
        <Sidebar page={path} setPage={setPath} loading={loading} isReduced={isReduced} />
        <Content
          data={data}
          cookies={cookies}
          status={status}
          setStatus={setStatus}
          newPath={newPath}
          setNewPath={setNewPath}
          setLoading={setLoading}
          setUpdate={setUpdate}
          onDroped={onDrop}
          setOnDrop={setOnDrop}
          mainRef={mainRef}
          isReduced={isReduced}
          setIsReduced={setIsReduced}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const cookies = ctx.req.headers.cookie;
  if (!cookies) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      cookies: JSON.parse(JSON.stringify(cookies)),
    },
  };
}
