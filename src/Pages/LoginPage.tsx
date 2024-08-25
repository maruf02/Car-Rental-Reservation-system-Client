import { Button } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../Redux/features/auth/authApi";
import { useAppDispatch } from "../Redux/hooks";
import { setUser } from "../Redux/features/auth/authSlice";
import { verifyToken } from "../Redux/verifyToken";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "user1@example.com",
      password: "password123",
    },
  });

  const [login, { data, error }] = useLoginMutation();
  console.log("server login data", data);
  console.log("server login error", error);
  const onSubmit = async (data: any) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    login(userInfo);
    console.log("data", userInfo);
    const res = await login(userInfo).unwrap();
    const user = verifyToken(res.data.accessToken);

    dispatch(setUser({ user: user, token: res.data.accessToken }));
    // dispatch(setUser({ user: {}, token: res.data.accessToken }));
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="id">ID: </label>
          <input
            className="text-white"
            type="text"
            id="email"
            {...register("email")}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            className="text-white"
            type="text"
            id="password"
            {...register("password")}
          />
        </div>
        <Button htmlType="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
