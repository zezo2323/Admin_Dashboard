import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // For Docker deployment

  serverExternalPackages: [
    "@node-rs/xxhash",
    "@node-rs/argon2",
  ],
};

export default nextConfig;
