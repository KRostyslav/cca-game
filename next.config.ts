import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Гра не має бекенду — фіксуємо корінь, щоб Turbopack не шукав його вище по дереву.
  turbopack: { root: __dirname },
  // Індикатор Next не потрібен поверх ігрового інтерфейсу.
  devIndicators: false,
};

export default nextConfig;
