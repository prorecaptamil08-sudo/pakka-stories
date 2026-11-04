import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Fonts are bundled locally (public/fonts, copied from the @fontsource packages) and
 * registered with @remotion/fonts, which holds Remotion's delayRender() until every
 * face is ready. No network access is required at render time.
 */
const FONT_DIR = 'fonts';

const register = (family: string, files: Array<{weight: string; file: string}>) => {
  for (const {weight, file} of files) {
    loadFont({
      family,
      url: staticFile(`${FONT_DIR}/${file}`),
      weight,
      format: 'woff2',
    });
  }
  return `'${family}', system-ui, sans-serif`;
};

export const FONT_UI = register('Inter', [
  {weight: '500', file: 'inter-latin-500-normal.woff2'},
  {weight: '600', file: 'inter-latin-600-normal.woff2'},
  {weight: '700', file: 'inter-latin-700-normal.woff2'},
  {weight: '800', file: 'inter-latin-800-normal.woff2'},
]);

export const FONT_DISPLAY = register('Montserrat', [
  {weight: '800', file: 'montserrat-latin-800-normal.woff2'},
  {weight: '900', file: 'montserrat-latin-900-normal.woff2'},
]);

export const FONT_CHALK = register('Caveat', [
  {weight: '600', file: 'caveat-latin-600-normal.woff2'},
  {weight: '700', file: 'caveat-latin-700-normal.woff2'},
]);
