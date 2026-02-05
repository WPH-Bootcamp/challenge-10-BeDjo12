"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchPostsByAuthor, fetchAuthorDetails } from "@/features/posts/api";
import * as PostUI from "@/components/ui/posts";
import { PostItem, UserProfile } from "@/types/blog";
import note from "@/../public/note.svg";

// Interface tambahan untuk menghapus error 'headline'
interface ExtendedUserProfile extends UserProfile {
  headline?: string;
}

function AuthorProfileContent() {
  const params = useParams();
  const authorId = params.id as string;

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [author, setAuthor] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAuthorData = async () => {
  try {
    setLoading(true);
    
    // Panggil endpoint by-user
    const postsRes = await fetchPostsByAuthor(authorId);
    
    // Ambil data posts dari postsRes.data
    setPosts(postsRes.data || []);
    
    // Ambil data profil user dari postsRes.user (Sesuai JSON response Anda)
    if (postsRes.user) {
      setAuthor(postsRes.user);
    } else {
      // Fallback jika karena suatu hal field .user tidak ada
      const authorRes = await fetchAuthorDetails(authorId);
      setAuthor(authorRes.data || authorRes);
    }

  } catch (err) {
    console.error("Gagal memuat profil:", err);
    // Jika user memang tidak punya post, pastikan profil tetap dicoba ambil
    try {
       const authorRes = await fetchAuthorDetails(authorId);
       setAuthor(authorRes.data || authorRes);
    } catch(e) { console.error("User tidak ditemukan"); }
  } finally {
    setLoading(false);
  }
};
    if (authorId) getAuthorData();
  }, [authorId]);

  if (loading)
    return <div className="pt-40 text-center font-bold text-[#0093DD]">Loading Profile...</div>;

  return (
    <main className="max-w-5xl mx-auto pt-32 px-6 pb-20">
      {/* HEADER PROFIL */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src={author?.avatarUrl || "https://i.pravatar.cc/150"}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#0093DD]"
          alt={author?.name}
        />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {author?.name}
          </h1>
          {/* Menggunakan headline yang sekarang sudah ada di interface */}
          <p className="text-neutral-500">{author?.headline || "Author"}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">{posts.length} Post</h2>

      {posts.length > 0 ? (
        <div className="flex flex-col gap-10">
          {posts.map((post) => (
            <div key={post.id} className="border-b pb-8 border-neutral-200">
              {/* 1. Komponen Title membutuhkan 'id' dan 'text' */}
              <PostUI.Title
                text={post.title}
                id={post.id}
                className="text-xl mb-3"
              />

              {/* 2. Komponen Tags menangani array string/object secara otomatis */}
              <PostUI.Tags tags={post.tags || []} className="mb-3" />

              {/* 3. Komponen Description membersihkan HTML jika perlu */}
              <PostUI.Description
                text={post.content?.replace(/<[^>]*>/g, "") || ""}
                className="mt-3 line-clamp-3"
              />

              <div className="mt-4 flex justify-between items-center">
                {/* 4. Komponen Author */}
                <PostUI.Author 
                  author={post.author || author} 
                  date={post.createdAt} 
                />
                
                {/* 5. Komponen Stats (Opsional, jika ingin menampilkan like/comment) */}
                {/* <PostUI.Stats postId={post.id} likes={0} comments={0} /> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 border-t border-neutral-100">
          <Image src={note} alt="No posts" className="w-40 h-40 opacity-50" />
          <div className="text-center">
            <p className="font-bold text-lg text-neutral-800">
              No posts from this user yet
            </p>
            <p className="text-neutral-500">Stay tuned for future posts</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AuthorProfilePage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center">Loading...</div>}>
      <AuthorProfileContent />
    </Suspense>
  );
}