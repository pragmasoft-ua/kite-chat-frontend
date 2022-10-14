module.exports = {
  logLevel: 'debug',
  stories: ['../src/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  features: {
    postcss: false,
  },
  webpackFinal: async (config) => {
    const newRules = config.module.rules.filter(
      ({test}) => !(test instanceof RegExp && test.source.includes('css'))
    );
    newRules.push({
      test: /\.css/i,
      resourceQuery: /raw/,
      type: 'asset/source',
      use: ['postcss-loader'],
    });
    config.module.rules = newRules;
    return config;
  },
};
