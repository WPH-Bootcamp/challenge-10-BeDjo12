"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import logo from "@/../public/logo-symbol.svg";
import Register from "./Register";
import { fetchUserProfile } from "@/features/profile/api";
import { UserProfile } from "@/types/blog";

const BASE_URL = "https://be-blg-production.up.railway.app";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchUserProfile();
        if (data) setUser(data);
      } catch (err) {
        console.error("Gagal load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
    const handleUpdate = () => {
      loadProfile();
    };

    window.addEventListener("profileUpdate", handleUpdate);
    return () => window.removeEventListener("profileUpdate", handleUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false);
    setShowProfileDropdown(false);
  };

  const getAvatarUrl = () => {
    if (!user) return "";
    if (user.avatarUrl && user.avatarUrl !== "null" && user.avatarUrl !== "") {
      const path = user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${BASE_URL}${user.avatarUrl.startsWith("/") ? "" : "/"}${user.avatarUrl}`;
      return `${path}?v=${new Date().getTime()}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=0093DD&color=fff`;
  };

  if (isLoading)
    return (
      <div className="w-11 h-11 rounded-full bg-neutral-100 animate-pulse" />
    );

  return (
    <>
      {/* DESKTOP & MOBILE WRAPPER */}
      <div className="flex items-center gap-6" ref={dropdownRef}>
        {!user ? (
          <>
            {/* Tampilan Desktop saat Belum Login */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="/login"
                className="font-semibold text-[14px] underline text-[#0093DD]"
              >
                Login
              </a>
              <a href="/register" className="w-45.5 h-11">
                <Register />
              </a>
            </div>

            {/* Tampilan Mobile saat Belum Login */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(true)} className=" flex w-6 h-6">
                <FiMenu className="w-6 h-6 text-neutral-800" />
              </button>
            </div>
          </>
        ) : (
          /* TAMPILAN SETELAH LOGIN*/
          <div className="relative flex items-center gap-3 md:gap-6 h-11">
            <Link href="/write-post">
              <img
                src="/WritePost.svg"
                alt="write post"
                className="w-24.75 h-7 hidden md:block"
              />
            </Link>
            <div className="border border-neutral-300 h-5.75 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="md:w-10 md:h-10 w-8 h-8 rounded-full overflow-hidden border border-[#0093DD]"
              >
                <img
                  src={getAvatarUrl()}
                  alt="Profile"
                  className="object-cover w-full h-full cursor-pointer"
                />
              </button>
              <div className="hidden md:block"> {user.name}</div>
            </div>

            {/* DROPDOWN */}
            {showProfileDropdown && (
              <div className="absolute right-0 md:-right-12 md:mt-4 top-full mt-2 w-45.5 bg-white rounded-xl shadow-xl border border-neutral-300 py-3 z-50">
                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50"
                >
                  <FiUser className="w-4 h-4 md:w-5 md:h-5 " />
                  <div className="text-[12px] md:text-[14px]  ">Profile</div>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50"
                >
                  <FiLogOut className="w-4 h-4 md:w-5 md:h-5" />{" "}
                  <div className="text-[12px] md:text-[14px] ">Logout</div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!user && (
        <div
          className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex px-4 justify-between items-center h-20 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="Logo" className="w-5 h-5" />
              <p className="font-semibold text-lg">Your Logo</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col w-53.5 items-center gap-4 absolute top-25.75 left-1/2 -translate-x-1/2">
            <a
              href="/login"
              className="font-semibold text-[14px] text-[#0093DD] underline underline-offset-3"
            >
              Login
            </a>
            <a href="/register" className="w-full h-11">
              <Register />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
