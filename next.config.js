module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    config.module.rules.push({
      test: /\.svg$/,     
      use: ['@svgr/webpack'],
    });
    return config;
  },
  future: {
    webpack5: true,
  },
};
