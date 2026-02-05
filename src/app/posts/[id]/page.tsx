"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchPostById,
  fetchCommentsByPostId,
  createComment,
  fetchRecommendedPosts,
} from "@/features/posts/api";
import { fetchUserProfile } from "@/features/profile/api";
import {
  Post as PostType,
  CommentResponse,
  PostItem,
  UserProfile,
} from "@/types/blog";

// Import modul modular yang baru dibuat
import * as PostUI from "@/components/ui/posts";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<PostType | null>(null);
  const [anotherPost, setAnotherPost] = useState<PostType | PostItem | null>(
    null,
  );
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        window.scrollTo(0, 0);

        const [postRes, commentsRes, recommendedRes, userRes] =
          await Promise.allSettled([
            fetchPostById(id as string),
            fetchCommentsByPostId(id as string),
            fetchRecommendedPosts(5, 1),
            fetchUserProfile(),
          ]);

        if (postRes.status === "fulfilled")
          setPost(postRes.value.data || postRes.value);
        if (commentsRes.status === "fulfilled")
          setComments(commentsRes.value || []);
        if (recommendedRes.status === "fulfilled") {
          const rec = recommendedRes.value.data || recommendedRes.value;
          setAnotherPost(
            rec.find((p: any) => String(p.id) !== String(id)) || rec[0],
          );
        }
        if (userRes.status === "fulfilled") setCurrentUser(userRes.value);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentInput.trim() || !currentUser) return;
    try {
      const newComment = await createComment(Number(id), {
        content: commentInput,
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentInput("");
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen font-bold">
        Loading...
      </div>
    );
  if (!post)
    return <div className="text-center py-20 font-bold">Post Not Found</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      {/* Container utama w-200 (800px) */}
      <main className="max-w-200 mt-30 w-full py-10 px-4 flex flex-col">
        <PostUI.Title
          text={post.title}
          id={post.id}
          className="text-9 md:text-10 mb-6"
        />

        <div className="mb-8">
          <PostUI.Author
            author={post.author}
            date={post.createdAt || "2025-05-27"}
            className="text-sm"
          />
        </div>

        <PostUI.Image
          src={post.imageUrl}
          className="w-full aspect-video mb-10"
        />

        {/* Tags Detail */}
        <PostUI.Tags tags={post.tags} className="mb-6" />

        <article className="text-neutral-800 leading-8 text-4.5 mb-16 whitespace-pre-line wrap-break-words w-full">
          {post.content}
        </article>

        <hr className="border-neutral-100 mb-12" />

        {/* SECTION COMMENT */}
        {/* SECTION COMMENT */}
        <section className="mb-20">
          <h2 className="text-6 font-bold mb-8">
            Comments ({comments.length})
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={currentUser?.avatarUrl || "https://i.pravatar.cc/150?u=me"}
              className="w-11 h-11 rounded-full object-cover"
              alt="user"
            />
            <p className="font-bold text-neutral-900">
              {currentUser?.name || "Guest User"}
            </p>
          </div>

          <div className="mb-10 bg-neutral-50 p-6 rounded-6">
            <textarea
              className="w-full border-none rounded-3 p-4 h-32 focus:ring-1 focus:ring-[#0093DD] bg-white shadow-sm"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitComment}
                className="bg-[#0093DD] text-white px-10 py-3 rounded-full font-bold hover:bg-[#007bbd] transition-colors"
              >
                Send Comment
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Menampilkan 3 komentar pertama */}
            {comments.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="border-b border-neutral-50 pb-6 last:border-0"
              >
                <p className="font-bold text-3.5 text-[#0093DD]">{c.name}</p>
                <p className="text-neutral-700 text-4 mt-2 leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}

            {/* Tombol See All - SEKARANG SELALU MUNCUL JIKA ADA KOMENTAR */}
            {comments.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[#0093DD] font-bold hover:underline mt-4 flex items-center gap-2"
              >
                See All {comments.length} Comments
              </button>
            )}
          </div>
        </section>

        {/* ANOTHER POST SECTION */}
        {anotherPost && (
          <section className="mt-20 border-t pt-10">
            <h2 className="text-6 font-bold mb-8">Another Post</h2>
            <div
              onClick={() => router.push(`/posts/${anotherPost.id}`)}
              className="flex flex-col md:flex-row gap-6 cursor-pointer group"
            >
              <PostUI.Image
                src={anotherPost.imageUrl}
                className="w-full md:w-80 h-52"
              />
              <div className="flex flex-col justify-center flex-1 gap-2">
                <PostUI.Title
                  text={anotherPost.title}
                  id={anotherPost.id}
                  className="text-5.5 group-hover:text-[#0093DD] transition-colors"
                />
                <PostUI.Tags tags={anotherPost.tags} />

                <PostUI.Description
                  text={anotherPost.content}
                  className="text-3.5 line-clamp-2"
                />
                <div className="mt-2">
                  <PostUI.Author
                    author={anotherPost.author}
                    date={anotherPost.createdAt}
                    className="text-xs"
                  />
                  <PostUI.Stats
                    likes={"likes" in anotherPost ? anotherPost.likes : 0}
                    comments={
                      "comments" in anotherPost ? anotherPost.comments : 0
                    }
                    className="mt-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* POPUP MODAL COMMENTS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-137.5 max-h-160 rounded-6 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-5 font-bold">Comments ({comments.length})</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded-full"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 bg-neutral-50">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="mb-6 bg-white p-4 rounded-3 shadow-sm"
                >
                  <p className="font-bold text-sm text-[#0093DD]">{c.name}</p>
                  <p className="text-neutral-700 text-sm mt-1 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
