import { masaToolsProvider, useMasaToolsHook } from './common/helpers/provider';
import { masaRestClient } from './common/rest';

export interface Props {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  test?: string;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const rest = masaRestClient;
export const MasaToolsProvider = masaToolsProvider
export const useMasaTools = useMasaToolsHook
