import Head from "next/head"
import { useState } from "react"
import { Header, Sidebar } from "../components"
import { Index, Part } from "../types/index";

export default function Home() {
  const [page, setPage] = useState<Part>("my_drive");
  return (
    <>
      <Head>
        <title>Cloud</title>
      </Head>
      <Header title="Cloud" />

      <Sidebar page={page} setPage={setPage} />
    </>
  )
}
