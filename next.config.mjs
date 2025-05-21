/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    OLLAMA_URL: process.env.OLLAMA_URL || 'http://127.0.0.1:11434'
  },
  webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
          config.resolve.fallback = {
            ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
              // by next.js will be dropped. Doesn't make much sense, but how it is
            fs: false, // the solution
            module: false,
            perf_hooks: false,
          };
        }
    
        return config
      },
      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
};



export default nextConfig;
