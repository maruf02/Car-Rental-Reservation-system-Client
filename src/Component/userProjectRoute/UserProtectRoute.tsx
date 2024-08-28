import React, { ReactNode } from "react";
import { useAppSelector } from "../../Redux/hooks";
import {
  useCurrentToken,
  useCurrentUser,
} from "../../Redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";

const UserProtectRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(useCurrentToken);
  const user = useAppSelector(useCurrentUser);

  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }
  if (user.role != "user") {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default UserProtectRoute;
