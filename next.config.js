/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["rouge-event-images.s3.eu-west-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
