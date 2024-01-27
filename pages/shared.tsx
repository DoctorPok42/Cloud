import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Sidebar,
  Content,
} from "../components";
import { Part } from "../types/index";

interface SharedProps {
  cookies: string;
}

export default function Shared({ cookies }: SharedProps) {
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1] as string;
  const [path, setPath] = useState<Part>("shared_drive");
  const [newPath, setNewPath] = useState<string>("Storage");
  const [status, setStatus] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);

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

  return (
    <>
      <Head>
        <title>Cloud | Shared</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>
      <div className="container">
        <Sidebar page={path} setPage={setPath} loading={loading} />
        <Content
          data={data}
          cookies={cookies}
          status={status}
          setStatus={setStatus}
          newPath={newPath}
          setNewPath={setNewPath}
          setLoading={setLoading}
          setUpdate={setUpdate}
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
