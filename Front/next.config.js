/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ["cdn.jsdelivr.net","ipfs.filebase.io"],
  },
};

module.exports = nextConfig;
