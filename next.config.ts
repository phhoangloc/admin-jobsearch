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
    api_url_: "http://localhost:4002/",
    home_url: "https://home-jobsearch.vercel.app/",
    ftp_url: "https://image.buoncf.jp/career/",
  }
};

export default nextConfig;
