"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchSearch } from "@/features/posts/api";
import * as PostUI from "@/components/ui/posts";
import { PostItem } from "@/types/blog";
import note from "@/../public/note.svg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiSearch } from "react-icons/fi";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query); // Update input jika URL berubah
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetchSearch(query);
        setResults(res.data || []);
      } catch (err) {
        console.error("Error search:", err);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Header />

      {/* Container utama disesuaikan agar padding-top pas dengan Header */}
      <div className="max-w-5xl w-full mx-auto pt-24 md:pt-32 px-6 pb-20">
        {/* INPUT KHUSUS MOBILE (Hanya muncul di SM, hilang di MD) */}
        <div className="md:hidden mb-8">
          <form
            onSubmit={handleMobileSubmit}
            className="relative flex items-center"
          >
            <FiSearch className="absolute left-4 text-neutral-400 w-5 h-5" />
            <input
              autoFocus
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full h-12 pl-12 pr-4 bg-white border border-neutral-300 rounded-full outline-none focus:border-[#0093DD] text-[16px]"
            />
          </form>
        </div>

        {loading ? (
          <div className="text-center py-10 text-neutral-500 font-medium">
            Searching for posts...
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-10">
            <h1 className="text-2xl font-bold text-neutral-800 hidden md:block">
              Results for "{query}"
            </h1>

            <div className="flex flex-col gap-8">
              {results.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col md:flex-row gap-6 border-b pb-8 border-neutral-200 last:border-0"
                >
                  <PostUI.Image className="w-full md:w-80 h-52 hidden md:block" />
                  <div className="flex flex-col gap-3 flex-1 justify-between">
                    <div className="space-y-3">
                      <PostUI.Title
                        text={post.title}
                        id={post.id}
                        className="text-5 md:text-6 group-hover:text-[#0093DD] transition-colors"
                      />
                      <PostUI.Tags tags={post.tags} />

                      <PostUI.Description
                        text={post.content}
                        className="text-3.5 line-clamp-2"
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
                        className="text-3 text-neutral-500"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <Image src={note} alt="Not Found Illustration" />
            <div className="flex flex-col gap-1 items-center text-center">
              <p className="text-[14px] md:text-[16px] font-semibold text-neutral-800">
                No result Found
              </p>
              <p className="text-[14px] md:text-[16px] text-neutral-500">
                Try using different keywords
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-8 h-11 bg-[#0093DD] rounded-full text-white font-medium hover:bg-[#007bbd] transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-40 text-center text-neutral-500">Loading...</div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
