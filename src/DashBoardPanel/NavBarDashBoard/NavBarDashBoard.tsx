import { useState } from "react";
import {
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useAppDispatch } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
};
// type adminMenuItem = Required<MenuProps>["adminItems"][number];
// type userMenuItem = Required<MenuProps>["userItems"][number];

const adminItems: MenuItem[] = [
  { key: "1", icon: <PieChartOutlined />, label: "Dashboard" },
  { key: "2", icon: <DesktopOutlined />, label: "Manage Car" },
  { key: "3", icon: <DesktopOutlined />, label: "Manage Booking" },
  { key: "4", icon: <DesktopOutlined />, label: "Manage Return" },
  { key: "5", icon: <DesktopOutlined />, label: "User Management" },
  { key: "6", icon: <DesktopOutlined />, label: "Report" },
  { key: "7", icon: <DesktopOutlined />, label: "Homepage" },
  // { key: "7", icon: <DesktopOutlined />, label: "imageUP" },
];
const userItems: MenuItem[] = [
  { key: "1", icon: <PieChartOutlined />, label: "DashBoard" },
  { key: "2", icon: <DesktopOutlined />, label: "Booking Management" },
  { key: "3", icon: <ContainerOutlined />, label: "Payment Management" },
  { key: "4", icon: <ContainerOutlined />, label: "Homepage" },
];

interface User {
  role: string;
  email: string;
  // Add other properties if necessary
}
const NavBarDashBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user) as User;
  const { role, email } = user;
  console.log(role);

  const handleLogout = () => {
    console.log("object");
    dispatch(logout());
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleAdminMenuClick: MenuProps["onClick"] = (e) => {
    const { key } = e;
    switch (key) {
      case "1":
        navigate("/DashBoard/admin");
        break;
      case "2":
        navigate("/DashBoard/ManageCars");
        break;
      case "3":
        navigate("/DashBoard/ManageBooking");
        break;
      case "4":
        navigate("/DashBoard/ManageReturn");
        break;
      case "5":
        navigate("/DashBoard/ManageUsers");
        break;
      case "6":
        navigate("/DashBoard/ReportGenerate");
        break;
      case "7":
        navigate("/");
        break;
      // case "7":
      //   navigate("/DashBoard/imageUP");
      //   break;
      // Add more cases for other menu items if needed
      default:
        break;
    }
  };
  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    const { key } = e;
    switch (key) {
      case "1":
        navigate("/DashBoard/user");
        break;
      case "2":
        navigate("/DashBoard/BookingManagement");
        break;
      case "3":
        navigate("/DashBoard/ManagePayment");
        break;
      case "4":
        navigate("/");
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <div></div>
      <div className="hidden lg:block">
        {role === "admin" ? (
          <div>
            <div className="pt-2 pb-0">
              <section className="text-3xl font-bold text-center justify-center align-middle">
                Admin DashBoard
              </section>
              <section className="text-md font-semibold text-center">
                Hello: {email}
              </section>
              <section className="text-md font-semibold text-center pt-2">
                <Button onClick={handleLogout} type="primary" danger>
                  Logout
                </Button>
              </section>
            </div>
            <div style={{ width: 256 }}>
              <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{ marginBottom: 16, backgroundColor: "#48CFCB" }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
              <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={adminItems}
                onClick={handleAdminMenuClick}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="pt-2 pb-0">
              <section className="text-3xl font-bold text-center justify-center align-middle">
                User DashBoard
              </section>
              <section className="text-md font-semibold text-center">
                Hello: {email}
              </section>
              <section className="text-md font-semibold text-center pt-2">
                <Button onClick={handleLogout} type="primary" danger>
                  Logout
                </Button>
              </section>
            </div>
            <div style={{ width: 256 }}>
              <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{ marginBottom: 16, backgroundColor: "#48CFCB" }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
              <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={userItems}
                onClick={handleUserMenuClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBarDashBoard;
