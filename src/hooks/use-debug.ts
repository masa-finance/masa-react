import { DependencyList, useEffect } from 'react';
import { useConfig } from '../base-provider';

export const useDebug = (
  values: {
    name: string;
    value: unknown;
  },
  deps: DependencyList = []
) => {
  const {
    masaConfig: { verbose },
  } = useConfig();

  const { name, value } = values;

  useEffect(() => {
    if (verbose) console.log(`DEBUG: ${name}`, value);
  }, [name, value, verbose, deps]);
};
