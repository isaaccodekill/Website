import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2B4A47",
          borderRadius: "32px",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#F4F2ED",
            fontFamily: "Georgia, serif",
          }}
        >
          I
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
