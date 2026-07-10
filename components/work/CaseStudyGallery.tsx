import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface CaseStudyGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function CaseStudyGallery({ images, className = "" }: CaseStudyGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${className}`.trim()}>
      {images.map((img) => (
        <figure key={img.src} className="m-0">
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
