"use client";

import { useRouter, usePathname } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/search") {
    return null;
  }

  const handleMobileClick = () => {
    router.push("/search");
  };

  return (
    <div className="flex md:hidden items-center">
      <button
        onClick={handleMobileClick}
        className="text-neutral-600 hover:bg-neutral-100 transition-colors"
      >
        <FiSearch className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Search;
