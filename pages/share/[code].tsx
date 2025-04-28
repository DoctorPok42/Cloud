import { useEffect, useState } from 'react';
import { decodeType } from '../../utils/files';
import Image from 'next/image';

const Code = ({ code }: any) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");

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
        setFileName(data.name);
        const fileData = data.data;
        const fileType = decodeType(fileData.type);
        const fileBuffer = Buffer.from(fileData.data, "base64");
        const blob = new Blob([fileBuffer], { type: fileType });
        setFile(blob);
        setLoading(false);
      } else {
        setError(data.error ?? "Something went wrong");
      }
    } catch (error: any) {
      setError("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (file) {
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
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
          <h1>Share File by Link</h1>
          {error && <p className='error'>Error: {error}</p>}
          {!error && loading ? <p>Fetching your file...</p> : !error && <p>File fetched successfully!</p>}

          {loading && <Image src="/favicon.ico" alt="logo" width={50} height={50} style={{ animation: "spin 1s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9)" }} />}

          {(!loading && !error) && <>
            <p>Click the button below to download your file.</p>
            <button className='btn' onClick={handleDownload}>Download File</button>
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