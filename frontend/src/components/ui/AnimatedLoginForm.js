import React from "react";
import styles from "./AnimatedLoginForm.module.css";

const AnimatedLoginForm = () => (
  <div className={styles.container}>
    <div className={styles["login-box"]}>
      <h2>Login</h2>
      <form action="#">
        <div className={styles["input-box"]}>
          <input type="email" required />
          <label>Email</label>
        </div>
        <div className={styles["input-box"]}>
          <input type="password" required />
          <label>Password</label>
        </div>
        <div className={styles["forgot-pass"]}>
          <button type="button" className={styles.link}>Forgot your password?</button>
        </div>
        <button type="submit" className={styles.btn}>Login</button>
        <div className={styles["signup-link"]}>
          <button type="button" className={styles.link}>Signup</button>
        </div>
      </form>
    </div>
    {[...Array(50)].map((_, i) => (
      <span key={i} style={{"--i": i}}></span>
    ))}
  </div>
);

export default AnimatedLoginForm;
