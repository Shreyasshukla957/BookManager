/** @type {import('next').NextConfig} */
const configuredBackendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const backendUrl = configuredBackendUrl.replace(/\/$/, "").replace(/\/api$/, "");

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;