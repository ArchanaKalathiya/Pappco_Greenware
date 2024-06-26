import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/card/card";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME } from "../../../redux/features/auth/authSlice";
import Loader from "../../../loader/Loader";

const initialState = {
  name: "",
  email: "",
  address: "",
  postcode: "",
  contact: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { name, email, address, postcode, contact, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !password2 || !address || !postcode || !contact) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (postcode.length < 6) {
      return toast.error("Postcode must be up to 6 characters");
    }
    if (contact.length < 10) {
      return toast.error("Contact No. must be up to 10 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid Email");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      name, email, address, postcode, contact, password
    };
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2 className={styles.loginTitle}>Sign Up</h2>
          <form onSubmit={register}>
            <input type="text" placeholder="Name" required name="name" value={name} onChange={handleInputChange} />
            <input type="email" placeholder="Email" required name="email" value={email} onChange={handleInputChange} autoComplete="email" />
            <input type="text" placeholder="Address" required name="address" value={address} onChange={handleInputChange} />
            <input type="text" placeholder="Postcode" required name="postcode" value={postcode} onChange={handleInputChange} />
            <input type="text" placeholder="Contact" required name="contact" value={contact} onChange={handleInputChange} autoComplete="tel" />
            <input type="password" placeholder="Password" required name="password" value={password} onChange={handleInputChange} autoComplete="new-password" />
            <input type="password" placeholder="Confirm Password" required name="password2" value={password2} onChange={handleInputChange} autoComplete="new-password" />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Sign Up
            </button>
          </form>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Already have an account? &nbsp;</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
