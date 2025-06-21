import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/post",
        destination: "/",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tfin",
        destination: "/tFIN",
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
