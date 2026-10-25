import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/analytics.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/analytics.js',
  platform: 'browser',
});

console.log('✓ Analytics script built successfully');
