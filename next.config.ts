import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xui94xt04b.ufs.sh",
        port: "",
      },
    ],
  },
};

export default nextConfig;
