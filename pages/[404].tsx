import Head from "next/head";
import styles from "../styles/404.module.scss";

const NotFound = () => {
  return (
    <div className={styles.notfound}>
      <Head>
        <title>Not Found | Cloud</title>
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>

      <div className={styles.box}>
        <div className={styles.title}>
          <h2>404</h2>
        </div>
        <div className={styles.button}>
          <a href="javascript:history.back()">Go Back</a>
          <a href="/">Go Home</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
