import Head from "next/head";
import ping from "ping";
import styles from "../styles/Status.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Status = ({ results }: any) => {
  return (
    <div className={styles.status}>
      <Head>
        <title>Status | Cloud</title>
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>
      <div className={styles.back}>fsd</div>
      <div className={styles.box}>
        <div className={styles.title}>
          <h2>Status</h2>
        </div>
        <div className={styles.goback}>
          <FontAwesomeIcon
            onClick={() => {
              javascript: history.back();
            }}
            icon={faCircleArrowLeft}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.host}>
            <h4 className={styles.host}>
              {results.inputHost} (
              <span
                style={{
                  color: results.alive ? "var(--green)" : "var(--red)",
                }}
              >
                {results.alive ? "Online" : "Offline"}
              </span>
              )
            </h4>
            {results.alive ? (
              <h4 className={styles.ping}>
                Ping : <span>{results.time}</span>
              </h4>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const hosts = process.env.SFTP_URL;

  let res = await ping.promise.probe(hosts as string);

  return {
    props: {
      results: JSON.parse(JSON.stringify(res)),
    },
  };
}

export default Status;
