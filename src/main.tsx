import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root/Root";
import ErrorPage from "./ErrorPage/ErrorPage";
import HomePage from "./Pages/Homepage/HomePage";
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
import ManageCars from "./DashBoardPanel/AdminPanel/ManageCars/ManageCars";
import UserManagement from "./DashBoardPanel/AdminPanel/UserManagement/UserManagement";
import BookingManagement from "./DashBoardPanel/UserPanel/BookingManagement/BookingManagement";
import ManageBooking from "./DashBoardPanel/AdminPanel/ManageBooking/ManageBooking";
import ManageReturn from "./DashBoardPanel/ManageReturn/ManageReturn";
import IimageUpload from "./DashBoardPanel/ManageReturn/IimageUpload";
import PaymentManagement from "./DashBoardPanel/UserPanel/PaymentManagement/PaymentManagement";
import ReportGenerate from "./DashBoardPanel/AdminPanel/ReportGenerate/ReportGenerate";
import AboutUsPage from "./Pages/Homepage/AboutUsPage/AboutUsPage";
import CarPage from "./Pages/CarPage/CarPage";
import CarDetailsViewPage from "./Pages/CarDetailsViewPage/CarDetailsViewPage";
import BookingPage from "./Pages/BookingPage/BookingPage";
import BookingDetailsViewPage from "./Pages/BookingDetailsViewPage/BookingDetailsViewPage";

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
      {
        path: "/aboutus",
        element: <AboutUsPage />,
      },
      {
        path: "/cars",
        element: <CarPage />,
      },
      {
        path: "/carsDetailsView/:id",
        element: <CarDetailsViewPage />,
      },
      {
        path: "/Booking",
        element: <BookingPage />,
      },
      {
        path: "/bookingDetailsView/:id",
        element: <BookingDetailsViewPage />,
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
        path: "/DashBoard/ManageCars",
        element: (
          <AdminProtectRoute>
            <ManageCars />
          </AdminProtectRoute>
        ),
      },
      {
        path: "/DashBoard/imageUP",
        element: (
          <AdminProtectRoute>
            <IimageUpload />
          </AdminProtectRoute>
        ),
      },
      {
        path: "/DashBoard/ManageUsers",
        element: (
          <AdminProtectRoute>
            <UserManagement />
          </AdminProtectRoute>
        ),
      },
      {
        path: "/DashBoard/ManageBooking",
        element: (
          <AdminProtectRoute>
            <ManageBooking />
          </AdminProtectRoute>
        ),
      },

      {
        path: "/DashBoard/ManageReturn",
        element: (
          <AdminProtectRoute>
            <ManageReturn />
          </AdminProtectRoute>
        ),
      },
      {
        path: "/DashBoard/ReportGenerate",
        element: (
          <AdminProtectRoute>
            <ReportGenerate />
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
      {
        path: "/DashBoard/BookingManagement",
        element: (
          <UserProtectRoute>
            <BookingManagement />
          </UserProtectRoute>
        ),
      },
      {
        path: "/DashBoard/ManagePayment",
        element: (
          <UserProtectRoute>
            <PaymentManagement />
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
