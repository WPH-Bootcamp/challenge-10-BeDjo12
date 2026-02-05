"use client";
import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { loginUser } from "@/features/auth/api";
import { loginpayload } from "@/types/blog";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<loginpayload>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage({});
    setIsLoading(true);

    try {
      const res = await loginUser(payload);
      localStorage.setItem("token", res.token);
      router.refresh();
      router.push("/");
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.details && Array.isArray(errorData.details)) {
        const newErrors: { email?: string; password?: string } = {};
        errorData.details.forEach((msg: string) => {
          if (msg.toLowerCase().includes("email")) newErrors.email = msg;
          else if (msg.toLowerCase().includes("password"))
            newErrors.password = msg;
        });
        setErrorMessage(newErrors);
      } else if (errorData?.message) {
        setErrorMessage({ email: errorData.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof loginpayload, value: string) => {
    setPayload({ ...payload, [field]: value });
    if (errorMessage[field]) {
      setErrorMessage({ ...errorMessage, [field]: undefined });
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col w-86.25 gap-5 p-6  rounded-xl border  border-neutral-200 shadow-[0_0_24px_0_rgba(205,204,204,0.16)] md:w-100"
      >
        <h1 className="font-bold text-[20px]/[34px] ">Sign In</h1>
        <div className=" w-full flex flex-col gap-1">
          <p className="font-semibold text-[14px]/[28px] ">Email</p>
          <input
            type="email"
            value={payload.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter Your Email"
            className={`w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none ${
              errorMessage.email ? "border-[#EE1D52]" : "border-neutral-300"
            }`}
          />
          {errorMessage && (
            <span className="text-[#EE1D52] text-[12px] md:text-[14px]">
              {errorMessage.email}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col gap-1">
          <p className="font-semibold text-[14px]/[28px] ">Password</p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={payload.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter Your Password"
              className={`w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none ${
                errorMessage.password
                  ? "border-[#EE1D52]"
                  : "border-neutral-300 "
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2   cursor-pointer transition-colors"
            >
              {showPassword ? (
                <IoEyeOutline className="w-5 h-5 text-neutral-950" />
              ) : (
                <IoEyeOffOutline className="w-5 h-5 text-neutral-950" />
              )}
            </button>
          </div>
          {errorMessage && (
            <span className="text-[#EE1D52] text-[12px] md:text-[14px]">
              {errorMessage.password}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="flex w-full text-[14px]/[28px] font-semibold h-12 items-center justify-center bg-[#0093DD] text-white rounded-full cursor-pointer hover:bg-linear-to-br hover:from-[#02a4f5] hover:to-[#01537c] hover:scale-102 transition-all ease-in-out duration-500 "
        >
          Login
        </button>
        <div className="flex gap-0.5 justify-center">
          <p className="text-[14px]/[28px]">Don't have an account?</p>
          <a
            href="/register"
            className="text-[14px]/[28px] font-semibold text-[#0093DD] hover:text-[#04699b] hover:underline hover:underline-offset-4 hover:font-bold transition-all ease-in-out duration-500"
          >
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
