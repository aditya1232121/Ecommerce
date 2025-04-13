import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loader from "../Loader/Loader";
import "./Profile.css";

export default function Profile() {
  const { user, loading } = useSelector((state) => state.user);

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>{`${user.name}'s Profile`}</title>
      </Helmet>

      <div className="profileContainer">
        {/* Left section with image and edit button */}
        <div>
          <h1>Profile</h1>
          <img
            src={user.avatar?.url || "/defaultAvatar.png"}
            alt={user.name}
          />
          <Link to="/me/update">Edit Profile</Link>
        </div>

        {/* Right section with details and links */}
        <div>
          <div>
            <h4>Full Name</h4>
            <p>{user.name}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{user.email}</p>
          </div>
          <div>
            <h4>Joined On</h4>
            <p>{String(user.createdAt).substring(0, 10)}</p>
          </div>

          {/* Links for Orders & Change Password */}
          <div>
            <Link to="/orders">My Orders</Link>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
