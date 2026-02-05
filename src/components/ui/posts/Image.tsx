interface ImageProps {
  src?: string | null;
  className?: string;
}

export const Image = ({ className }: ImageProps) => {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-neutral-100 shrink-0 ${className}`}
    >
      <img
        // Menggunakan file lokal di folder public
        src="/image.svg"
        alt="Post Illustration"
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/600x400?text=Blog+Post";
        }}
      />
    </div>
  );
};
