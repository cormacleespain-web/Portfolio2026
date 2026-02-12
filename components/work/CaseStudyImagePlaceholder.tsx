interface CaseStudyImagePlaceholderProps {
  label: string;
  aspectRatio?: "video" | "square" | "wide";
  className?: string;
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

/**
 * Placeholder block for case study images. Replace with real Image when assets are ready.
 */
export function CaseStudyImagePlaceholder({
  label,
  aspectRatio = "video",
  className = "",
}: CaseStudyImagePlaceholderProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface ${aspectClasses[aspectRatio]} ${className}`.trim()}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <span className="text-body-sm font-medium text-text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}
