import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import { useState } from "react";
import { NextApiResponse } from "next";

import styles from "../styles/Login.module.scss";
import { Alert, CircularProgress } from "@mui/material";

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
        <title>Cloud | Login</title>
        <meta name="description" content="Cloud" />
        <meta name="author" content="DoctorPok" />
        <meta name="keywords" content="Cloud" />
      </Head>

      <Image
        className={styles.img}
        src="/login.jpg"
        alt="Cloud"
        width={3000}
        height={3000}
      />
      <div className={styles.login}>
        <div className={styles.title}>
          <Image
            src="/favicon.ico"
            alt="Cloud"
            className={styles.logo}
            width={70}
            height={70}
            style={{
              animation: loading ? "spin 1s linear infinite" : "",
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
              backgroundColor: loading ? "var(--blue)" : "var(--black)",
              cursor: loading ? "not-allowed" : "pointer",
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
            {loading && (
              <CircularProgress
                size={20}
                className={styles.circle}
                color="inherit"
              />
            )}
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
