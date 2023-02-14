import Head from "next/head";
import { useEffect, useState } from "react";
import { Header, Sidebar, Content, UploadButton } from "../components";
import { Part } from "../types/index";
import { Client } from "ssh2";

interface SharedProps {
  dataFirst: any;
  cookies: string;
}

export default function Shared({ dataFirst, cookies }: SharedProps) {
  const [path, setPath] = useState<string>("shared_drive");
  const [newPath, setNewPath] = useState<string>("Storage");
  const [status, setStatus] = useState<string>("");
  const [data, setData] = useState<any>(dataFirst);
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
      <Header title="Cloud" cookies={cookies} loading={loading} />

      <Sidebar page={path} setPage={setPath} />
      <Content
        data={data}
        cookies={cookies}
        status={status}
        setStatus={setStatus}
        path={path}
        newPath={newPath}
        setNewPath={setNewPath}
        loading={loading}
        setUpdate={setUpdate}
      />
      <UploadButton
        cookies={cookies}
        setStatus={setStatus}
        setUpdate={setUpdate}
      />
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

  const conn = new Client();
  const data = await new Promise((resolve, reject) => {
    conn
      .on("ready", function () {
        conn.sftp(function (err: any, sftp: any) {
          if (err) throw err;
          sftp.readdir(
            "/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/Storage",
            function (err: any, list: any) {
              if (err) throw err;
              resolve(list);
              conn.end();
            }
          );
        });
      })
      .connect({
        host: process.env.SFTP_URL,
        port: process.env.SFTP_PORT as unknown as number,
        username: process.env.SFTP_USERNAME,
        password: process.env.SFTP_PASSWORD,
      });
  });
  return {
    props: {
      dataFirst: JSON.parse(JSON.stringify(data)),
      cookies: JSON.parse(JSON.stringify(cookies)),
    },
  };
}
