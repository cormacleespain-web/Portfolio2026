import Image from "next/image";

interface BeforeAfterImage {
  src: string;
  alt: string;
  caption?: string;
}

interface CaseStudyBeforeAfterProps {
  /** Exactly two images, in order: [before, after]. */
  images: BeforeAfterImage[];
  className?: string;
}

const LABELS = ["Before", "After"] as const;

export function CaseStudyBeforeAfter({ images, className = "" }: CaseStudyBeforeAfterProps) {
  const pair = images.slice(0, 2);
  if (pair.length < 2) return null;

  return (
    <div className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${className}`.trim()}>
      {pair.map((img, i) => (
        <figure key={img.src} className="m-0">
          <p className="mb-2 text-caption font-semibold uppercase tracking-wider text-text-subtle">
            {LABELS[i]}
          </p>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
          {img.caption && (
            <figcaption className="mt-2 text-caption text-text-subtle">{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
