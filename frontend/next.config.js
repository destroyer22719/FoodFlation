/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.shop.loblaws.ca", "assets.sellers.loblaw.ca", "product-images.metro.ca"]
  }
}

module.exports = nextConfig
