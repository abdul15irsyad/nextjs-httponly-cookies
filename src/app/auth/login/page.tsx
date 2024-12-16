"use client";

import { axiosBase } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { FormEventHandler, useCallback, useState } from "react";

interface LoginForm {
  email: string;
  password: string;
}

const initialLoginForm = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);

  const { mutateAsync: loginAsync, isPending } = useMutation<
    any,
    Error,
    LoginForm
  >({
    mutationKey: ["login", loginForm],
    mutationFn: async (data) => {
      const response = await axiosBase.post("/auth/login", data, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await loginAsync(loginForm);
        setLoginForm(initialLoginForm);
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
      }
    },
    [router, loginForm, loginAsync]
  );

  return (
    <div className="flex justify-center items-center  h-screen">
      <div className="bg-gray-50 p-6 w-4/12 rounded-xl">
        <h2 className="text-2xl text-center mb-3 font-bold">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="example@email.com"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm((state) => ({
                  ...state,
                  email: e.target.value,
                }))
              }
              className="border rounded-md py-2 px-3 w-full"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              placeholder="password"
              onChange={(e) =>
                setLoginForm((state) => ({
                  ...state,
                  password: e.target.value,
                }))
              }
              className="border rounded-md py-2 px-3 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              className={`shadow  ${
                isPending ? "bg-gray-400" : "bg-blue-500"
              } hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
              type="submit"
            >
              {isPending ? "Loading..." : <span>Login</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
