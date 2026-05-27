/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  output: undefined,
  outputFileTracingRoot: require("path").join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
