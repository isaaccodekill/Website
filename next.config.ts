import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async headers() {
    return [
      "/cms/:path*",
      "/api/posts/:path*",
      "/api/media/:path*",
      "/api/cms/:path*",
      "/api/upload",
    ].map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "private, no-store" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    }));
  },
};
export default nextConfig;
