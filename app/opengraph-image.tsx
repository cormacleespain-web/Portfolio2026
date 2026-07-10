import { ImageResponse } from "next/og";
import { siteData } from "@/content/siteData";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "6px", background: "#2dd4bf", borderRadius: "3px" }} />
          <div style={{ width: "28px", height: "6px", background: "#f97316", borderRadius: "3px" }} />
        </div>
        <div style={{ display: "flex", fontSize: "88px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {siteData.hero.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "24px",
            fontSize: "32px",
            color: "#a8a29e",
            maxWidth: "980px",
          }}
        >
          {siteData.hero.positioningLine}
        </div>
      </div>
    ),
    { ...size },
  );
}
