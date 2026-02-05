"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { api } from "@/lib/api";
import { fetchCommentsByPostId } from "@/features/posts/api";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | number;
  commentsCount: number;
  onCommentSuccess?: () => void;
}

export const CommentModal = ({
  isOpen,
  onClose,
  postId,
  commentsCount,
  onCommentSuccess,
}: CommentModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = async () => {
    if (!postId) return;
    try {
      const data = await fetchCommentsByPostId(postId.toString());
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load komentar:", err);
    }
  };

  useEffect(() => {
    if (isOpen) loadComments();
  }, [isOpen, postId]);

  const handleSend = async () => {
    if (!commentText.trim() || !postId) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");

      await api.post(
        `/comments/${postId}`,
        { content: commentText.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (onCommentSuccess) {
        onCommentSuccess();
      }

      setCommentText("");

      onClose();
    } catch (err) {
      alert("Gagal mengirim komentar. Pastikan Anda sudah login.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-105 rounded-xl shadow-2xl p-6 overflow-hidden flex flex-col text-black">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-black">
            Comments ({commentsCount})
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-black transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Input Area */}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-4 h-32 focus:ring-2 focus:ring-[#0093DD] outline-none bg-white mb-4 text-black placeholder:text-gray-400"
          placeholder="Write your comment here..."
        />

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={isLoading || !commentText.trim()}
          className="w-full bg-[#0093DD] hover:bg-[#0082c4] text-white py-3 rounded-full font-bold shadow-md disabled:bg-gray-300 transition-all active:scale-95"
        >
          {isLoading ? "Sending..." : "Send Comment"}
        </button>

        {/* List Komentar Sebelumnya */}
        <div className="mt-6 overflow-y-auto max-h-50 space-y-4 pr-1 custom-scroll">
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">
            Recent Comments
          </h3>
          {comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c.id}
                className="border-b border-gray-50 pb-3 last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-black">
                    {c.user?.name || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm py-4">
              No comments yet.
            </p>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
