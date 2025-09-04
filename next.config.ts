import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Ensure pages generate as directories with index.html
  trailingSlash: true,
  // Disable built-in image optimization (not compatible with static export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
