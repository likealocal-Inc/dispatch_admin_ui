/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    KAKAO_KEY: process.env.KAKAO_JAVASCRIP_KEY,
    HTTP_PROTOCAL: process.env.HTTP_PROTOCAL,
    SERVER_IP: process.env.SERVER_IP,
    SERVER_PORT: process.env.SERVER_PORT,
    REDIS_IP: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    LOCALSTORAGE_KEY: process.env.LOCALSTORAGE_KEY,
  },

  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
