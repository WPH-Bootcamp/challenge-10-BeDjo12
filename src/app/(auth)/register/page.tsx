"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { registerUser } from "@/features/auth/api";
import Register from "@/components/ui/Register";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage({});

    if (payload.password !== confirmPassword) {
      setErrorMessage({ confirmPassword: "Passwords do not match!" });
      return;
    }

    try {
      await registerUser({
        ...payload,
        username: payload.email.split("@")[0] || "user",
      });

      alert("Registration Successful!");
      router.push("/login");
    } catch (err: any) {
      const errorData = err.response?.data;
      const newErrors: any = {};

      if (Array.isArray(errorData?.details)) {
        errorData.details.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("name")) newErrors.name = msg;
          else if (lowerMsg.includes("email")) newErrors.email = msg;
          else if (lowerMsg.includes("password")) newErrors.password = msg;
        });
      } else if (errorData?.message?.includes("Email")) {
        newErrors.email = errorData.message;
      }

      setErrorMessage(newErrors);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col w-86.25 gap-5 p-6  rounded-xl border border-neutral-200 shadow-[0_0_24px_rgba(205,204,204,0.16)] md:w-100"
      >
        <h1 className="font-bold text-[20px]/[34px]">Sign Up</h1>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[14px]/[28px]">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            className={`w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none ${
              errorMessage.name ? "border-[#EE1D52]" : "border-neutral-300"
            }`}
          />
          {errorMessage.name && (
            <span className="text-[#EE1D52] text-[12px] md:text-[14px]">
              {errorMessage.name}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[14px]/[28px]">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={payload.email}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
            className={`w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none ${
              errorMessage.email ? "border-[#EE1D52]" : "border-neutral-300"
            }`}
          />
          {errorMessage.email && (
            <span className="text-[#EE1D52] text-[12px] md:text-[14px]">
              {errorMessage.email}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[14px]/[28px]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your pasword"
              value={payload.password}
              onChange={(e) =>
                setPayload({ ...payload, password: e.target.value })
              }
              className={`w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none ${
                errorMessage.password
                  ? "border-[#EE1D52]"
                  : "border-neutral-300 "
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            >
              {showPassword ? (
                <IoEyeOutline className="w-5 h-5 text-neutral-950" />
              ) : (
                <IoEyeOffOutline className="w-5 h-5 text-neutral-950" />
              )}
            </button>
          </div>
          {errorMessage.password && (
            <span className="text-[#EE1D52] text-[12px] md:text-[14px]">
              {errorMessage.password}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[14px]/[28px]">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Enter your confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none ${
                errorMessage.password
                  ? "border-[#EE1D52]"
                  : "border-neutral-300 "
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className=" absolute right-4 top-1/2 -translate-y-1/2   cursor-pointer transition-colors"
            >
              {showConfirm ? (
                <IoEyeOutline className="w-5 h-5 text-neutral-950" />
              ) : (
                <IoEyeOffOutline className="w-5 h-5 text-neutral-950" />
              )}
            </button>
          </div>
          {errorMessage.confirmPassword && (
            <span className="text-[#EE1D52] text-[12px] md:text-[14px]">
              {errorMessage.confirmPassword}
            </span>
          )}
        </div>
        <div className="w-full h-12 text-[14px]/[28px]">
          <Register />
        </div>
        <div className="flex gap-0.5 justify-center">
          <p className="text-[14px]/[28px]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[14px]/[28px] font-semibold text-[#0093DD] hover:text-[#04699b] hover:underline hover:underline-offset-4 hover:font-bold transition-all ease-in-out duration-500"
            >
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
