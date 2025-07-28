import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "image.buoncf.jp",
        port: "",
        pathname: "/**"
      },
    ],
  },
  env: {
    api_url: "https://buoncf.jp:4002/",
    ftp_url: "https://image.buoncf.jp/career/",
  }
};

export default nextConfig;
