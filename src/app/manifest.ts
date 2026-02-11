import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Isaac Bello — Software Engineer",
    short_name: "Isaac A.",
    description: "Personal portfolio and blog of Isaac Bello",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F2ED",
    theme_color: "#2B4A47",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
