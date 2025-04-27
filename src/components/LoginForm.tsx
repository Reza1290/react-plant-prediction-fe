"use client";

import CryptoJS from "crypto-js";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import Alert from "@/components/Alert";
import { redirect } from "next/navigation";
import { useState } from "react";

type LoginFormProps = {
  username: string;
  password: string;
  isRegisterPage: Number;
};

const handleSubmitForm = (data: { username: string; password: string, isRegisterPage: Number }) => {
  try {
    console.log('submit',data.isRegisterPage)
    signIn("credentials", {
      username: data.username, 
      password: data.password,    
      isRegisterPage: data.isRegisterPage,
      redirectTo: '/dashboard'
    },);
  } catch (e) {

  } finally {
    // redirect('/dashboard')
  }
};


export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormProps>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isRegisterPage, setIsRegisterPage] = useState(0)
  
  const handleRegisterPage = () => {
    const newValue = isRegisterPage === 1 ? 0 : 1;
    setIsRegisterPage(newValue);
    setValue("isRegisterPage", newValue)
  }
  return (
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm p-24">
      <Alert />
      <form
        className="mt-5 space-y-6"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              {...register("username", {
                required: "username is required",

              })}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <span className="text-red-500 text-xs">{errors.username?.message}</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              {...register("password", { required: "Password is required" })}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <span className="text-red-500 text-xs">
            {errors.password?.message}
          </span>
        </div>
        <div>
          <p className="text-blue-500 text-xs cursor-pointer" onClick={(e) => handleRegisterPage()}>{isRegisterPage ? 'Login' : 'Register'}</p>
        </div>
        <input {...register("isRegisterPage")} type="hidden" id="isRegisterPage" name="isRegisterPage" value={isRegisterPage} />
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isRegisterPage ? 'Signup' : 'Signin'}
          </button>
        </div>
      </form>
    </div>
  );
}
