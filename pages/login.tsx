import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import { useState } from "react";

import styles from "../styles/Login.module.scss";
import { Alert } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const fet = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await fet.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setError("");
        router.push("/");
      }
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className={styles.login_container}>
      <Head>
        <title>Login | Cloud</title>
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>

      <div className={styles.back}></div>
      <div className={styles.login}>
        <div className={styles.title}>
          <Image
            src="/favicon.ico"
            alt="Cloud"
            className={styles.logo}
            width={70}
            height={70}
            style={{
              animation: loading
                ? "spin 1s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9)"
                : "",
            }}
          />
          <h2>Login</h2>
        </div>

        {error != "" && (
          <Alert
            className={styles.alert}
            severity="error"
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <form className={styles.form}>
          <div className={styles.input}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <a
            className={styles.button}
            style={{
              backgroundColor: loading
                ? "var(--blue)"
                : error != ""
                ? "var(--red)"
                : "var(--black)",
              cursor: loading ? "not-allowed" : "pointer",
              animation: error != "" ? "shake 0.5s" : "",
            }}
            onClick={() => {
              username && password != ""
                ? handleSubmit()
                : username == ""
                ? setError("Username is required")
                : setError("Password is required");
            }}
          >
            Login
          </a>
        </form>
      </div>
      <div className={styles.display_status}>
        <h2>
          --- Chek <a href="/status">status</a> ---
        </h2>
      </div>
    </div>
  );
};

export default Login;
