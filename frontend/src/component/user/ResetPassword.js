import React, { Fragment, useState, useEffect } from "react";
import { useNavigate  , useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPassword} from "../../actions/useraction";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import "./ResetPassword.css";
import LockOpenIcon from "@mui/icons-material/LockOpen"
import LockIcon from "@mui/icons-material/Lock";



export default function ResetPasswords() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // ✅ Get token from URL
  
    const { error, success, loading } = useSelector(
      (state) => state.forgotPassword
    );
  
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const updatePasswordSubmit = (e) => {
        e.preventDefault();
      
        const passwords = {
          password,
          confirmPassword,
        };
      
        dispatch(ResetPassword(token, passwords));
      };
      
  
    useEffect(() => {
      if (error) {
        toast.error(error);
      }
  
      if (success) {
        toast.success("Password Updated Successfully");
        navigate("/login");
      }
    }, [dispatch, error, success, navigate]);
  
    return (
      <Fragment>
        <MetaData title="Change Password" />
        <ToastContainer />
        {loading ? (
          <Loader />
        ) : (
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Password</h2>
  
              <form
                className="resetPasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
  
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
  
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        )}
      </Fragment>
    );
  }