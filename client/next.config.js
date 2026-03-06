/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  "redirects": [
    {
      "source": "/",
      "destination": "https://softwarestudio.cs.ou.edu/",
      "permanent": true
    },
  ],
};

module.exports = nextConfig;
