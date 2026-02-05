"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiEdit3,
  FiClock,
  FiX,
  FiThumbsUp,
  FiMessageSquare,
} from "react-icons/fi";
import note from "@/../public/note.svg";
import EditProfile from "@/components/EditProfile";
import Header from "@/components/Header";
import ChangePassword from "@/components/ui/ChangePassword";
import { fetchUserProfile, updateProfile } from "@/features/profile/api";
import { fetchMyPosts, deletePost } from "@/features/posts/api";
import { UserProfile, PostItem } from "@/types/blog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const BASE_URL = "https://be-blg-production.up.railway.app";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Your Post");
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);

  // Sekarang menggunakan headline sesuai blog.ts
  const [user, setUser] = useState<UserProfile>({
    id: 0,
    name: "",
    email: "",
    avatarUrl: "",
    headline: "",
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: number | null;
  }>({ isOpen: false, postId: null });
  const [statisticModal, setStatisticModal] = useState<{
    isOpen: boolean;
    postId: number | null;
  }>({ isOpen: false, postId: null });

  const loadData = async () => {
    try {
      const userData = await fetchUserProfile();
      if (userData) {
        const avatar = userData.avatarUrl?.startsWith("http")
          ? userData.avatarUrl
          : `${BASE_URL}${userData.avatarUrl}`;

        setUser({
          ...userData,
          avatarUrl: avatar || "https://i.pravatar.cc/150",
          headline: userData.headline || "", // Ambil langsung dari API
        });

        const postsData = await fetchMyPosts();
        setUserPosts(postsData.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (
    data: { name: string; job: string }, // data.job biasanya datang dari input Form
    file: File | null,
  ) => {
    try {
      await updateProfile({
        name: data.name,
        headline: data.job, // Kirim ke API sebagai headline
        avatar: file,
      });

      setUser((prev) => ({
        ...prev,
        name: data.name,
        headline: data.job, // Update state lokal sebagai headline
        avatarUrl: file ? URL.createObjectURL(file) : prev.avatarUrl,
      }));

      setIsEditProfileOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan profile:", error);
      alert("Gagal menyimpan data");
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-[#0093DD]">
        Loading Profile...
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center relative">
      <Header />
      <main className="max-w-200 w-full pt-32 px-6 pb-20">
        {/* PROFILE CARD */}
        <div className="border border-neutral-200 rounded-xl p-6 flex items-center justify-between shadow-sm bg-white">
          <div className="flex items-center gap-6">
            <img
              src={user.avatarUrl}
              className="w-24 h-24 rounded-full object-cover border shadow-sm"
              alt="Profile"
            />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {user.name}
              </h1>
              {/* Tampilkan headline di sini */}
              <p className="text-neutral-500 text-sm font-medium">
                {user.headline || "No headline set"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="text-[#0093DD] font-bold hover:underline"
          >
            Edit Profile
          </button>
        </div>

        {/* TABS */}
        <div className="mt-10 border-b flex gap-10">
          {["Your Post", "Change Password"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold relative ${activeTab === tab ? "text-[#0093DD]" : "text-neutral-400"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0093DD] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="mt-10">
          {activeTab === "Your Post" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{userPosts.length} Post</h2>
                <Link href="/write-post">
                  <button className="flex items-center gap-2 bg-[#0093DD] text-white px-6 py-2.5 rounded-full font-bold shadow-md">
                    <FiEdit3 /> Write Post
                  </button>
                </Link>
              </div>

              {userPosts.length > 0 ? (
                <div className="space-y-10">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col md:flex-row gap-6 border-b border-neutral-100 pb-10 group"
                    >
                      <div className="w-full md:w-80 h-48 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-neutral-100 border">
                        <img
                          src={post.imageUrl || "https://placehold.co/600x400"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          alt={post.title}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold group-hover:text-[#0093DD] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                          {post.content?.replace(/<[^>]*>/g, "")}
                        </p>
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[12px] text-neutral-400 flex items-center gap-1">
                            <FiClock size={14} />{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-4 font-bold text-[14px]">
                            <button
                              onClick={() =>
                                setStatisticModal({
                                  isOpen: true,
                                  postId: post.id,
                                })
                              }
                              className="text-[#0093DD] hover:underline"
                            >
                              Statistic
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/write-post?edit=${post.id}`)
                              }
                              className="text-[#0093DD] hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  postId: post.id,
                                })
                              }
                              className="text-[#EE1D52] hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Image
                    src={note}
                    alt="No posts"
                    className="w-48 h-48 opacity-50"
                  />
                  <p className="text-neutral-500 mt-4">
                    Your writing journey starts here.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "Change Password" && (
            <div className="max-w-md mx-auto py-10">
              <ChangePassword />
            </div>
          )}
        </div>
      </main>

      {/* RENDER MODAL EDIT PROFILE */}
      {isEditProfileOpen && (
        <EditProfile
          user={{
            name: user.name,
            job: user.headline || "", // Kita kirim headline ke prop 'job' milik EditProfile
            avatarUrl: user.avatarUrl || "https://i.pravatar.cc/150",
          }}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      <Footer />
    </div>
  );
}
