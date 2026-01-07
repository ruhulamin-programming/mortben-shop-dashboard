"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAdminLoginMutation } from "@/lib/services/userApi";
import Image from "next/image";
import LoginImage from "@/assets/loginImage.jpg";
import SiteLogo from "@/assets/mortbenLogo.png";

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      email: "admin@gmail.com",
      password: "123456",
    },
  });
  const [loginFunction, { isLoading }] = useAdminLoginMutation();

  const handleLogin = async ({ email, password }: IFormInput) => {
    try {
      const response = await loginFunction({ email, password }).unwrap();
      if (response?.result?.accessToken) {
        Cookies.set("accessToken", response.result.accessToken);
        toast.success("Admin login successful");
        reset();
        router.push("/admin/overview");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      {/* Left Image */}
      <div className="lg:w-1/2 relative block lg:flex">
        <Image
          src={LoginImage}
          alt="login visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center px-10">
        <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-md">
          <div className="text-center">
            <Image src={SiteLogo} alt="mortben" width={200} />
          </div>

          <h2 className="text-green-600 text-xl font-semibold mb-2">
            Sign In Admin Dashboard
          </h2>

          {/* Phone Input */}
          <div className="mb-4">
            <input
              type="text"
              {...register("email", {
                required: "Email is required",
              })}
              placeholder="Enter Email"
              className="w-full px-4 py-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#6E498B] text-white py-3 rounded hover:bg-purple-800 transition cursor-pointer"
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
