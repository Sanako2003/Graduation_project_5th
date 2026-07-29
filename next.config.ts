import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  turbopack: {
    // ensure Turbopack uses this project directory as the workspace root
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
