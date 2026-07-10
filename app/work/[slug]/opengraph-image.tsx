import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project?.title ?? "Case Study";
  const category = project?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0c0a09",
          color: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#2dd4bf",
            marginBottom: "24px",
          }}
        >
          Case Study
        </div>
        <div style={{ display: "flex", fontSize: "80px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "28px",
            color: "#a8a29e",
            maxWidth: "980px",
          }}
        >
          {category}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
          <div style={{ width: "56px", height: "6px", background: "#2dd4bf", borderRadius: "3px" }} />
          <div style={{ width: "28px", height: "6px", background: "#f97316", borderRadius: "3px" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
