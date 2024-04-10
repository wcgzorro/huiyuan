/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['127.0.0.1','60.205.108.91','thirdwx.qlogo.cn','localhost','img.ipaintgarden.com','lh3.googleusercontent.com'],
  },
  experimental: {
    appDir: true
  },
  webpack: (config, options) => {
    // 添加 SVG 处理规则
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 返回更新后的配置
    return config;
  },
}

module.exports = nextConfig
