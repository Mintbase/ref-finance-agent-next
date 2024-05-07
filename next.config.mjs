/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('@ref-finance/ref-sdk');
        }
        return config;
    },
};

export default nextConfig;
