import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Header,
  Sidebar,
  Content,
  UploadButton,
  BreadCrumbs,
} from "../components";
import { Part } from "../types/index";
import { Client } from "ssh2";
import { verify_token } from "./api/functions";

interface MusiqueProps {
  dataFirst: any;
  cookies: string;
}

export default function Shared({ dataFirst, cookies }: MusiqueProps) {
  const username = cookies.split(";").find((item) => item.trim().startsWith("username="))?.split("=")[1] as string;
  const [path, setPath] = useState<Part>("music");
  const [newPath, setNewPath] = useState<string>("Musique");
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
        <title>Cloud | Musique</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>
      <Header title="Cloud" cookies={cookies} loading={loading} />

      <BreadCrumbs newPath={newPath} setNewPath={setNewPath} />
      <Content
        data={data}
        cookies={cookies}
        status={status}
        setStatus={setStatus}
        path={path}
        newPath={newPath}
        setNewPath={setNewPath}
        setLoading={setLoading}
        setUpdate={setUpdate}
      />
      <UploadButton
        cookies={cookies}
        setStatus={setStatus}
        setLoading={setLoading}
        newPath={newPath}
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

  const username = cookies.split(";").find((item: string) => item.trim().startsWith("username="))?.split("=")[1];
  const token = cookies.split(";").find((item: string) => item.trim().startsWith("token="))?.split("=")[1];

  const verify = verify_token(token)

  const conn = new Client();
  const data = await new Promise((resolve, reject) => {
    conn
      .on("ready", function () {
        conn.sftp(function (err: any, sftp: any) {
          if (err) throw err;
          sftp.readdir(
            "/srv/dev-disk-by-uuid-1e9d8d56-b293-4139-8bbc-861a333dd9ed/Musique",
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
        username: username,
        password: verify,
      });
  });
  return {
    props: {
      dataFirst: JSON.parse(JSON.stringify(data)),
      cookies: JSON.parse(JSON.stringify(cookies)),
    },
  };
}
