import Head from "next/head";
import { useState } from "react";
import { Header, Sidebar, Content } from "../components";
import { Index, Part } from "../types/index";
import { Client } from "ssh2";

export default function Shared({ data, cookies }: any) {
  const [page, setPage] = useState<Part>("shared_drive");
  return (
    <>
      <Head>
        <title>Cloud | Shared</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>
      <Header title="Cloud" cookies={cookies} />

      <Sidebar page={page} setPage={setPage} />
      <Content data={data} username={cookies.username} />
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
      page: ctx.query,
      data: JSON.parse(JSON.stringify(data)),
      cookies: JSON.parse(JSON.stringify(cookies)),
    },
  };
}
