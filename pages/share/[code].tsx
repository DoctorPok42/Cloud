import { useEffect, useState } from 'react';
import { decodeType } from '../../utils/files';
import Image from 'next/image';

const Code = ({ code }: any) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [link, setLink] = useState<HTMLAnchorElement>();

  const fetchShareField = async (code: string) => {
    try {
      const response = await fetch(`/api/getSharedFiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (response.ok) {
        const url = `data:${decodeType(code)};base64,${Buffer.from(
          data.data.data
        ).toString("base64")}`;
        const link = document.createElement("a");
        link.href = url;
        link.download = code;
        setLink(link);
      } else {
        setError(data.error ?? "Something went wrong");
      }
    } catch (error: any) {
      setError("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (code) {
      fetchShareField(code);
    } else {
      setError("Invalid code");
    }
  }, [code]);

  return (
    <div className='container' style={{ paddingRight: "0.8em", width: "calc(100% - 1.6em)" }}>
      <div className="share">
        <div className="content">
          <h1>Share File by Link ({code})</h1>
          {error && <p className='error'>Error: {error}</p>}
          {!error && loading ? <p>Fetching your file...</p> : !error && <p>File fetched successfully!</p>}

          {loading && <Image src="/favicon.ico" alt="logo" width={50} height={50} style={{ animation: "spin 1s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9)" }} />}

          {(!loading && !error) && <>
            <p>Click the button below to download your file.</p>
            <button className='btn' onClick={() => link.click()}>Download File</button>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default Code;

export function getServerSideProps(context: any) {
  const code = context.params.code;
  return {
    props: {
      code,
    },
  };
}