import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile, loadUser } from "../../actions/useraction";
import { UPDATE_PROFILE_RESET } from "../../constants/userconstants";
import Loader from "../Loader/Loader";
import "./UpdateProfile.css";
import MetaData from '../layout/MetaData'

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateProfileSubmit = (e) => {
    e.preventDefault();
  
    const myForm = new FormData();
myForm.append("name", name); // use append (safer)
myForm.append("email", email);
if (avatar) {
  myForm.append("avatar", avatar); // field name must match multer.single()
}
  
    dispatch(updateProfile(myForm)); // Pass FormData to the action
  };
  
  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setAvatar(file); // Set actual File, not base64
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }

    if (error) {
      toast.error(error);
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());
      navigate("/account");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, isUpdated, navigate, user]);

  return (
    <Fragment>
      <MetaData title="Update Profile" />
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="updateProfileContainer">
          <div className="updateProfileBox">
            <h2 className="updateProfileHeading">Update Profile</h2>
            <form
              className="updateProfileForm"
              encType="multipart/form-data"
              onSubmit={updateProfileSubmit}
            >
              <div className="signUpName">
                <FaceIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="signUpEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div id="updateProfileImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={updateProfileDataChange}
                />
              </div>

              <input type="submit" value="Update" className="updateProfileBtn" />
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}