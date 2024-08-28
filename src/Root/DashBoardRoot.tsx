import React from "react";
import NavBarDashBoard from "../DashBoardPanel/NavBarDashBoard/NavBarDashBoard";
import { Outlet } from "react-router-dom";
import FooterDashBoard from "../DashBoardPanel/FooterDashBoard/FooterDashBoard";

const DashBoardRoot = () => {
  return (
    <div className="w-full h-full min-h-screen bg-slate-100 text-black p-0 m-0">
      <NavBarDashBoard />
      <Outlet />
      <FooterDashBoard />
    </div>
  );
};

export default DashBoardRoot;
