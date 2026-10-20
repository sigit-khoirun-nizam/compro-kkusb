import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.10.122', '192.168.10.202', 'localhost', '127.0.0.1'],
};

export default nextConfig;