import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyc3.digitaloceanspaces.com",
        port: "",
        pathname: "/smtech-space/uploads/**", // ← Match your actual path
      },
      {
        protocol: "https",
        hostname: "mortben.fra1.digitaloceanspaces.com",
        port: "",
        pathname: "/mortben/uploads/**", // ← Match your actual path
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
};

export default nextConfig;
