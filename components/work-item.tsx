"use client";

interface WorkItemProps {
  title: string;
  category: string;
  description: string;
  image: string;
  /** When true, shows a small “Example” chip for placeholder stock photos */
  isExample?: boolean;
}

export function WorkItem({
  title,
  category,
  description,
  image,
  isExample = true,
}: WorkItemProps) {
  return (
    <div className="gallery-item border border-border/40 cursor-default">
      {/* Stock / project photo */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />

      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {isExample && (
            <span className="inline-block rounded bg-white/90 px-2 py-px text-[10px] font-semibold tracking-wide text-[var(--brand-navy)]">
              EXAMPLE
            </span>
          )}
          <span className="text-[10px] font-medium text-white/80 tracking-widest uppercase">
            {category}
          </span>
        </div>
        <h4 className="text-white font-semibold text-lg tracking-[-0.01em] leading-tight mb-1 drop-shadow-sm">
          {title}
        </h4>
        <p className="text-white/85 text-sm line-clamp-2 pr-2 drop-shadow-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
