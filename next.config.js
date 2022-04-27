/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const withInterceptStdout = require('next-intercept-stdout')(
  {
    reactStrictMode: true,
  },
  text => (text.includes('Duplicate atom key') ? '' : text),
);

const ContentSecurityPolicy = `
  media-src blob:;
  worker-src 'self' blob:;
  font-src 'self' fonts.gstatic.com fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  connect-src 'self' *.mikopj.live *.live-video.net cdn.jsdelivr.net fonts.gstatic.com fonts.googleapis.com vitals.vercel-insights.com;
  script-src  'self' *.mikopj.live 'wasm-unsafe-eval' 'unsafe-eval' cdn.jsdelivr.net;
`;

//  Image
// /cache/images 에 저장됨.
//  Cache-Control  > s-maxage > max-age

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['img.mikopj.live'], // 악의적 유저의 공격을 막기 위함.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // default , layout = fill or responsive
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // sizes가 제공 될 떄에만, deviceSizes와 크기가 일치하며 , 각 값은 작아야함.
    formats: ['image/avif', 'image/webp'], // avif는 인코딩 20퍼 but 크기 20퍼 다운 , accept 일치 우선순위,  비 일치시 원본 이미지
    minimumCacheTTL: 60 * 3, // seconds , default 60
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",  // for svg
    // layoutRaw:true
  },
  typescript: {
    ignoreBuildErrors: true, // dangerous
  },
  eslint: {
    ignoreDuringBuilds: true, // dangerous
  },
  experimental: {
    reactRoot: true,
    nextScriptWorkers: false,
    modularizeImports: {},
  },
  compiler: {
    // removeConsole: {
    //   exclude: ['error', 'info'],
    // },
  },
  productionBrowserSourceMaps: true, // default false , true로하면 빌드시간이 매우 상승하지만 디버깅에 조워짐 + 권장사항 점수 상승
  swcMinify: true,
  reactStrictMode: false, // 이거 하니깐 Socket 에러남
  compress: true, // default nginx에서 압축할 경우 false
  distDir: '.next', // default
  optimizeFonts: true, // default true
  generateBuildId: async () => {
    return Date.now().toString(); // 다중 서버를 할 경우 같은 값이 되어야함.
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          process.env.NODE_ENV === 'development'
            ? { key: 'Content-Security-Policy', value: '' }
            : {
                key: 'Content-Security-Policy',
                value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
              },
        ],
      },
    ];
  },
};

module.exports = withPlugins([
  [withBundleAnalyzer],
  [
    withPWA,
    {
      pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === 'development',
        runtimeCaching,
        buildExcludes: [/middleware-manifest\.json$/],
      },
    },
  ],
  [withInterceptStdout],
  nextConfig,
]);
