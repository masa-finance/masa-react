module.exports = {
  entryPoints: ['./src/index.tsx'],
  plugin: 'typedoc-plugin-markdown',
  name: 'Masa React',
  out: 'docs',
  disableSources: true,
  includeVersion: true,
};
