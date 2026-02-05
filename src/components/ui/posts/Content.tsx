import Link from "next/link";
import { FiThumbsUp, FiMessageSquare } from "react-icons/fi";

// --- KOMPONEN TITLE ---
interface TitleProps {
  text: string;
  id: number | string; // ID Post untuk navigasi
  className?: string;
}

export const Title = ({ text, id, className }: TitleProps) => (
  <Link href={`/posts/${id}`} className="group block">
    <h3
      className={`font-bold leading-tight group-hover:text-[#0093DD] transition-colors ${className}`}
    >
      {text}
    </h3>
  </Link>
);

// --- KOMPONEN DESCRIPTION ---
export const Description = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => <p className={`text-neutral-600 line-clamp-2 ${className}`}>{text}</p>;

// --- KOMPONEN AUTHOR ---
export const Author = ({
  author,
  date,
  className,
}: {
  author: any;
  date: string;
  className?: string;
}) => {
  const formatDate = (ds: string) => {
    if (!ds) return "No Date";
    return new Date(ds).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link
        href={`/author/${author?.id}`}
        className="flex gap-2 items-center group"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={author?.avatarUrl || "https://i.pravatar.cc/150"}
          className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:ring-2 group-hover:ring-[#0093DD]"
          alt=""
        />
        <span className="font-medium group-hover:text-[#0093DD] transition-colors">
          {author?.name}
        </span>
      </Link>
      <span className="text-neutral-400">•</span>
      <span className="text-neutral-500 text-sm">{formatDate(date)}</span>
    </div>
  );
};
