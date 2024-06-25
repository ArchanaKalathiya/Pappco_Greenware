import React, { useEffect, useState } from 'react';
import '../sidebar/Sidebar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getUser, logoutUser } from '../../services/authService';
import { SET_LOGIN, SET_USER, CLEAR_USER,  selectUser } from '../../redux/features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [portName, setPortName] = useState("");
  const [terms, setTerms] = useState("");

  useEffect(()=> {
    const handleUnauthorized = () => {
      dispatch(SET_LOGIN(false));
      navigate("/login");
    };

    const fetchUserData = async () => {
      try{
        const userData = await getUser();
        if(userData){
          dispatch(SET_USER(userData));
        }else{
          dispatch(CLEAR_USER());
        }
      }
      catch(error){
        console.error("Failed to fetch user data : ", error);
        if(error.response && error.response.status === 401){
          handleUnauthorized();
        }
      }
    };
    fetchUserData();
  },[dispatch, navigate]);


  const logout = async () => {
    await logoutUser();
    dispatch(SET_LOGIN(false));
    dispatch(CLEAR_USER());
    navigate("/login");
  };

  const currentDate = new Date().toLocaleDateString("en-GB");

  return (
    <div className="--pad header">
      <div className="--flex-between-header">
        <h3 className="welcome">
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">{user.name}</span>
        </h3>
        <div className='user-info'>
          <p>Email: {user.email}</p>
          <p>Address: {user.address}</p>
          <p>Postcode: {user.postcode}</p>
          <p>Contact: {user.contact}</p>
          <p>Date: {currentDate}</p>
          <div className='dropdown'>
            <label htmlFor="terms">Terms:</label>
            <select id="terms" value={terms} onChange={(e) => setTerms(e.target.value)}>
              <option value="" disabled>Select Terms</option>
              <option value="Option 1">Ex Works</option>
              <option value="Option 2">FOB</option>
            </select>
          </div>
          <div className='port-name'>
            <label htmlFor="portName">Port Name:</label>
            <input
              type="text"
              id="portName"
              placeholder="Enter Port Name"
              value={portName}
              onChange={(e) => setPortName(e.target.value)}
            />
          </div>
        </div>
        <button onClick={logout} className="--btn --btn-danger">
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
