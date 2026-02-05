"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecommendedPosts from "@/components/RecommendedPosts";
import MostLikedPosts from "@/components/MostLikedPosts";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full items-center">
      <Header />
      <main className="relative top-16 md:top-32 max-w-360 px-4 md:px-30 ">
        <div className="flex flex-col w-full md:max-w-360 max-w-98.25 md:flex-row md:gap-12">
          <RecommendedPosts />
          <div>
            <div className="border-l h-[97%] border-neutral-300"></div>
          </div>
          <MostLikedPosts />
        </div>
        <Footer />
      </main>
    </div>
  );
}
