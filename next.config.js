/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
  },
  images: {
    domains: ["utfs.io", "localhost:3000", "uploadthings.io", "img.clerk.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Add this line to ignore ESLint warnings during the build
  },
  async redirects() {
    return [
      {
        source: "/profile/sign-in",
        destination: "/profile/manageUsername", // Replace with your existing page
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
