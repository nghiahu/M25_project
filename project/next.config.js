module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'theme.hstatic.net',
          port: '',
          pathname: '/**',
        }
      ],
    },
  }
  /** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
}

module.exports = nextConfig