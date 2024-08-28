import React from "react";
import { useAppDispatch } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";

const AdminHomePage = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    console.log("object");
    dispatch(logout());
  };
  return (
    <div className="bg-white">
      <h2>AdminHomePage</h2>
      <button onClick={handleLogout}>AdminLogout</button>
      {/* baki sob page gula */}
    </div>
  );
};

export default AdminHomePage;
