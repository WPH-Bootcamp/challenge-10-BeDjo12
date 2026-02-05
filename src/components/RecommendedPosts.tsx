"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchRecommendedPosts } from "@/features/posts/api";
import * as PostUI from "@/components/ui/posts";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const RecommendedPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = (await fetchRecommendedPosts(5, page)) as any;
      setPosts(response.data ?? []);
      if (response.meta) {
        const total =
          response.meta.totalPages ||
          Math.ceil((response.meta.totalItems || 15) / 5);
        setTotalPages(total);
      }
    } catch (error) {
      console.error("Failed to fetch recommended posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);
  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loadData]);
  return (
    <section className="w-full flex flex-col px-4 gap-4 py-6 md:w-162.5 md:py-0">
      <h2 className="text-[20px] md:text-28px font-bold">Recommend For You</h2>

      <div
        className={`space-y-8 transition-opacity duration-300 ${isLoading ? "opacity-40" : "opacity-100"}`}
      >
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col md:flex-row gap-6 border-b border-neutral-200 pb-8 last:border-0 overflow-hidden"
          >
            <PostUI.Image className="w-full hidden md:block md:w-80 h-52 rounded-xl object-cover" />
            <div className="flex flex-col flex-1 justify-between">
              <div className="space-y-3">
                <PostUI.Title
                  text={post.title}
                  id={post.id}
                  className="text-[16px] group-hover:text-[#0093DD] transition-colors"
                />
                <PostUI.Tags tags={post.tags} />

                <PostUI.Description
                  text={post.content}
                  className="text-3.5 line-clamp-2 text-neutral-600"
                />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <PostUI.Author
                  author={post.author}
                  date={post.createdAt}
                  className="text-3"
                />
                <PostUI.Stats
                  likes={post.likes}
                  comments={post.comments}
                  postId={post.id}
                  onCommentSuccess={loadData}
                  className="text-3 text-neutral-500"
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 flex items-center justify-center gap-6 text-[15px] font-medium text-neutral-400">
        {/* Previous */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <HiOutlineChevronLeft size={20} />
          <span>Previous</span>
        </button>

        {/* Angka 1, 2, 3 */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                page === num
                  ? "bg-[#0093DD] text-white shadow-md shadow-blue-200"
                  : "text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>Next</span>
          <HiOutlineChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default RecommendedPosts;
