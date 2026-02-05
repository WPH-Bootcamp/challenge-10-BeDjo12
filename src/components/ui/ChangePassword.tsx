"use client";

import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { changePassword } from "@/features/profile/api";

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [payload, setPayload] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage({});

    if (payload.newPassword !== payload.confirmPassword) {
      setErrorMessage({ confirmPassword: "Passwords do not match!" });
      return;
    }

    try {
      setIsLoading(true);

      await changePassword({
        currentPassword: String(payload.currentPassword),
        newPassword: String(payload.newPassword),
        confirmPassword: String(payload.confirmPassword),
      });

      alert("Password updated successfully!");
      setPayload({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      const errorData = err.response?.data;
      console.log("Server Response:", errorData);

      const newErrors: any = {};

      if (Array.isArray(errorData?.message)) {
        errorData.message.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("current")) newErrors.currentPassword = msg;
          else if (lowerMsg.includes("new")) newErrors.newPassword = msg;
          else if (lowerMsg.includes("confirm"))
            newErrors.confirmPassword = msg;
        });
      } else {
        newErrors.currentPassword = errorData?.message || "Update failed";
      }
      setErrorMessage(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClass =
    "w-full h-12 rounded-xl flex px-4 py-2 text-[14px]/[28px] placeholder:text-[#717680] border outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5 py-6">
      <h1 className="font-bold text-[20px]/[34px]">Change Password</h1>

      {/* Input Current Password */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-[14px]/[28px]">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            value={payload.currentPassword}
            onChange={(e) =>
              setPayload({ ...payload, currentPassword: e.target.value })
            }
            className={`${inputBaseClass} ${errorMessage.currentPassword ? "border-[#EE1D52]" : "border-neutral-300 focus:border-[#0093DD]"}`}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showCurrent ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </button>
        </div>
        {errorMessage.currentPassword && (
          <span className="text-[#EE1D52] text-[12px]">
            {errorMessage.currentPassword}
          </span>
        )}
      </div>

      {/* Input New Password */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-[14px]/[28px]">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="New password"
            value={payload.newPassword}
            onChange={(e) =>
              setPayload({ ...payload, newPassword: e.target.value })
            }
            className={`${inputBaseClass} ${errorMessage.newPassword ? "border-[#EE1D52]" : "border-neutral-300 focus:border-[#0093DD]"}`}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showNew ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </button>
        </div>
        {errorMessage.newPassword && (
          <span className="text-[#EE1D52] text-[12px]">
            {errorMessage.newPassword}
          </span>
        )}
      </div>

      {/* Input Confirm Password */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-[14px]/[28px]">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={payload.confirmPassword}
            onChange={(e) =>
              setPayload({ ...payload, confirmPassword: e.target.value })
            }
            className={`${inputBaseClass} ${errorMessage.confirmPassword ? "border-[#EE1D52]" : "border-neutral-300 focus:border-[#0093DD]"}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showConfirm ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </button>
        </div>
        {errorMessage.confirmPassword && (
          <span className="text-[#EE1D52] text-[12px]">
            {errorMessage.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#0093DD] text-white rounded-xl font-bold hover:bg-[#007bbd] shadow-md transition-all active:scale-95 disabled:bg-neutral-300 mt-4"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
