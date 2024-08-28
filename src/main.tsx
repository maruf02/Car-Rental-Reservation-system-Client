import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root/Root";
import ErrorPage from "./ErrorPage/ErrorPage";
import HomePage from "./Pages/HomePage";
import { Provider } from "react-redux";
import { persistor, store } from "./Redux/store";

import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import DashBoardRoot from "./Root/DashBoardRoot";
import AdminHomePage from "./DashBoardPanel/AdminPanel/AdminHomePage";
import UserHomePage from "./DashBoardPanel/UserPanel/UserHomePage";
import UserProtectRoute from "./Component/userProjectRoute/UserProtectRoute";
import AdminProtectRoute from "./Component/AdminProtectRoute/AdminProtectRoute";
import LoginPage from "./Pages/LoginPage/LoginPage";
import SingUpPage from "./Pages/SingUpPage/SingUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      // {
      //   path: "/login",
      //   element: <LoginPage />,
      // },
      // {
      //   path: "/signup",
      //   element: <SingUpPage />,
      // },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SingUpPage />,
  },
  {
    path: "/DashBoard",
    element: (
      <ProtectedRoute>
        <DashBoardRoot />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/DashBoard/admin",
        element: (
          <AdminProtectRoute>
            <AdminHomePage />
          </AdminProtectRoute>
        ),
      },
      {
        path: "/DashBoard/user",
        element: (
          <UserProtectRoute>
            <UserHomePage />
          </UserProtectRoute>
        ),
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
