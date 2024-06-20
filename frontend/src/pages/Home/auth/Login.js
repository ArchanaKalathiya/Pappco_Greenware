import React from "react";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import Card from "../../../components/card/card";

const Login = () => {
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#999" />
          </div>
          <h2 className={styles.loginTitle}>Login</h2>

          <form>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              className={styles.input} // Example of using a scoped class
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              className={styles.input} // Example of using a scoped class
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
          </form>
          <div className={styles.forgotPassword}>
            <Link to="/forgotPassword">Forgot Password ?</Link>
          </div>

          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Don't have an account? &nbsp;</p>
            <Link to="/register">Sign up</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Login;
