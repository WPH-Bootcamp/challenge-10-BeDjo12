import Image from "next/image";
import logo from "@/../public/logo-symbol.svg";
import Search from "./ui/Search";
import Menu from "./ui/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="max-w-360 md:px-30 fixed flex px-4 bg-white z-50 justify-between items-center w-full h-16 md:h-20 border-b border-neutral-300">
      <Link
        href="/"
        className="flex items-center gap-[6.4px] w-[105.75px] md:w-[158.63] "
      >
        <Image
          src={logo}
          alt="Logo Symbol"
          className="w-[19.73px] h-[21.64px] md:w-[29.59] md:h-[32.46px] "
        />
        <p className="font-semibold text-[16px]/[24px] md:text-[24px]/[36px] font-outfit">
          Your Logo
        </p>
      </Link>
      <form
        onSubmit={handleSearch}
        className="hidden md:flex border border-neutral-300 relative items-center rounded-full px-4 py-2 md:max-w-94.25 w-full"
      >
        <FiSearch className="w-5 h-5 text-neutral-500 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-[14px] ml-3 w-full"
        />
      </form>

      <div className="flex gap-6 justify-between">
        <Search />
        <Menu />
      </div>
    </div>
  );
};

export default Header;
