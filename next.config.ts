import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Гра не має бекенду — фіксуємо корінь, щоб Turbopack не шукав його вище по дереву.
  turbopack: { root: __dirname },
  // Індикатор Next не потрібен поверх ігрового інтерфейсу.
  devIndicators: false,
  // До появи другого тренажера Architect жив у корені — старі посилання й закладки ведемо туди.
  async redirects() {
    return ["/play/:path*", "/world/:path*", "/codex/:path*", "/exam/:path*", "/train", "/stats"].map(
      (source) => ({ source, destination: `/architect${source}`, permanent: false }),
    );
  },
};

export default nextConfig;
