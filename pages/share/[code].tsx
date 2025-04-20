import { useEffect, useState } from 'react';
import { decodeType } from '../../utils/files';

const Code = ({ code }: any) => {
  const [error, setError] = useState<string>("");

  const fetchShareField = async (code: string) => {
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
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError(data.error ?? "Something went wrong");
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
          {!error && <p>Fetching your file...</p>}
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