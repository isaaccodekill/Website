import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Isaac Bello";
  const subtitle = searchParams.get("subtitle") || "Software Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#F4F2ED",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "80px",
            right: "80px",
            height: "1px",
            backgroundColor: "#D5D3CE",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "600",
              color: "#2B4A47",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              color: "#4A6B68",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Teal accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "140px",
            left: "80px",
            width: "120px",
            height: "4px",
            backgroundColor: "#2B4A47",
            borderRadius: "2px",
          }}
        />

        {/* Author name at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#7A9694",
            }}
          >
            Isaac Bello
          </div>
        </div>

        {/* Decorative corner */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            fontSize: "14px",
            fontFamily: "monospace",
            color: "#7A9694",
            letterSpacing: "0.08em",
          }}
        >
          belloisaac.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
