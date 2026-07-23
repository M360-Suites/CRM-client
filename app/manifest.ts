import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CRM 360",
    short_name: "CRM360",
    description:
      "A Customer Relationship Management (CRM) client application for firms.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#b7410e",
    icons: [
      {
        src: "assets/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "assets/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "assets/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "assets/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "assets/screenshot1.png",
        sizes: "341x662",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "assets/screenshot2.png",
        sizes: "719x373",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
