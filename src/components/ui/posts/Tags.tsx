interface TagsProps {
  tags: any[];
  className?: string;
}

export const Tags = ({ tags, className }: TagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-row gap-2 w-full overflow-hidden ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-white border px-3 py-1 flex justify-center items-center border-neutral-300 h-7 min-w-fit rounded-lg text-[12px] text-neutral-900 shadow-sm transition-all hover:border-[#0093DD]/50"
        >
          {typeof tag === "string" ? tag : tag.name}
        </span>
      ))}
    </div>
  );
};
