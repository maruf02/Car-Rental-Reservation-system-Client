import React from "react";
import { useAppDispatch } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";

const UserHomePage = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    console.log("object");
    dispatch(logout());
  };
  return (
    <div>
      <h2>UserHomePage</h2>
      <button onClick={handleLogout}>UserLogout</button>
    </div>
  );
};

export default UserHomePage;
