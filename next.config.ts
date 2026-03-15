import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/taishoku-shindan",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
