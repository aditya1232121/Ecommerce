import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../../actions/useraction"; // ✅ renamed to avoid conflict
import { useDispatch } from "react-redux";

// ✅ Import toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserOptions({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dashboard = () => {
    navigate("/dashboard");
  };

  const orders = () => {
    navigate("/orders");
  };

  const account = () => {
    navigate("/account");
  };

  const cart = () => {
    navigate("/cart");
  };

  const handleLogout = () => {
    dispatch(logoutAction()); // ✅ Dispatch actual logout
    toast.success("Logout successfully");
    navigate("/"); // ✅ Redirect to homepage or login
  };

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ShoppingCartIcon />, name: "Cart", func: cart },
    { icon: <ExitToAppIcon />, name: "Logout", func: handleLogout },
  ];

  if (user?.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  return (
    <Fragment>
      <ToastContainer position="top-center" autoClose={2000} />
      <Backdrop open={open} style={{ zIndex: 10 }} />

      <SpeedDial
        ariaLabel="User Options"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: 11 }}
        open={open}
        className="speedDial"
        direction="down"
        icon={
          <img
            className="speedDialIcon"
            src={user?.avatar?.url || "/Profile.png"}
            alt="User Avatar"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
}
