"use client";

import { useState, useEffect } from "react";
import { FiThumbsUp, FiMessageSquare } from "react-icons/fi";
import { CommentModal } from "../Comment";
import { api } from "@/lib/api"; // Import api untuk request like

export const Stats = ({
  likes,
  comments,
  postId,
  onCommentSuccess,
  className,
}: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes || 0);
  const [commentsCount, setCommentsCount] = useState(comments || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLikesCount(likes || 0);
    setCommentsCount(comments || 0);
  }, [likes, comments]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");

      // Kirim perintah like ke server agar permanen
      // Sesuaikan rute /posts/${postId}/like dengan backend-mu
      await api.post(
        `/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Jika berhasil di server, update di layar
      setLikesCount((prev: number) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Gagal Like:", err);
      alert("Gagal memberikan like. Pastikan Anda sudah login.");
    }
  };

  const handleInternalSuccess = () => {
    setCommentsCount((prev: number) => prev + 1);
    if (onCommentSuccess) onCommentSuccess();
  };

  return (
    <>
      <div className={`flex gap-5 text-neutral-500 ${className}`}>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-[#0093DD]" : "hover:text-neutral-800"}`}
        >
          <FiThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
          <span className="font-medium text-[14px]">{likesCount}</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 hover:text-neutral-800"
        >
          <FiMessageSquare size={18} />
          <span className="font-medium text-[14px]">{commentsCount}</span>
        </button>
      </div>

      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={postId}
        commentsCount={commentsCount}
        onCommentSuccess={handleInternalSuccess}
      />
    </>
  );
};
