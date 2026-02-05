"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchMostLikedPosts } from "@/features/posts/api";
import { PostItem } from "@/types/blog";
import * as PostUI from "@/components/ui/posts";

const MostLikedPosts = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchMostLikedPosts(3, 1);

      const normalizedPosts: PostItem[] = (response.data || []).map(
        (post: any) => ({
          ...post,
          likes: post.likes ?? post.likesCount ?? 0,
          comments: post.comments ?? post.commentsCount ?? 0,
        }),
      );

      setPosts(normalizedPosts);
    } catch (err) {
      console.error("Gagal memuat Most Liked:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <section className="w-full flex flex-col py-6 md:py-0">
      <h2 className="text-5 md:text-6 font-bold text-neutral-900 tracking-tight">
        Most liked
      </h2>

      <div
        className={`flex flex-col ${
          isLoading ? "opacity-40" : "opacity-100"
        } transition-opacity`}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-b flex flex-col border-neutral-300 py-4 gap-4 md:py-5 group"
          >
            <div className="flex flex-col gap-1">
              <PostUI.Title
                text={post.title}
                id={post.id}
                className="text-4 md:text-5 group-hover:text-[#0093DD] transition-colors"
              />

              <PostUI.Description
                text={post.content}
                className="text-neutral-900 line-clamp-2"
              />
            </div>

            <PostUI.Author author={post.author} date={post.createdAt} />

            <PostUI.Stats
              likes={post.likes}
              comments={post.comments}
              postId={post.id}
              onCommentSuccess={loadData}
              className="text-3 text-neutral-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostLikedPosts;
