import React, { Fragment, useState, useEffect } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ForgotPassword } from "../../actions/useraction";
import Loader from "../Loader/Loader";
import "./ForgotPassword.css";
import MetaData from '../layout/MetaData'

export default function ForgotPasswords() {
    const dispatch = useDispatch();
 
  
    const { error, message, loading } = useSelector(
      (state) => state.forgotPassword
    );
  
    const [email, setEmail] = useState("");
  
    const forgotSubmit = (e) => {
      e.preventDefault();
  
      if (!email) {
        toast.error("Please enter your email.");
        return;
      }
  
      const myForm = new FormData();
      myForm.append("email", email);
  
      dispatch(ForgotPassword(myForm));
    };
  
    useEffect(() => {
      if (error) {
        toast.error(error);
      }
      if (message) {
        toast.success(message);
      }
    }, [error, message]);
  
    return (
      <Fragment>
        <MetaData title="Forgot Password" />
        <ToastContainer />
        {loading ? (
          <Loader />
        ) : (
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>
              <form className="forgotPasswordForm" onSubmit={forgotSubmit}>
                <div className="forgotPasswordEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <input type="submit" value="Send" className="forgotPasswordBtn" />
              </form>
            </div>
          </div>
        )}
      </Fragment>
    );
  }