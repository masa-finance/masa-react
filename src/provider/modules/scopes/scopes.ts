import { SoulNameDetails } from '@masa-finance/masa-sdk';
import { useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

export const useScopes = (
  soulnames?: SoulNameDetails[],
  identity?: {
    identityId?: BigNumber;
    address?: string;
  },
  isLoggedIn?: boolean,
  verbose?: boolean
) => {
  const [scope, setScope] = useState<string[]>([]);
  const areScopesFullfiled = useMemo(() => {
    if (verbose) {
      console.info({ scope, soulnames, isLoggedIn });
    }

    if (scope?.includes('identity') && (!identity || !identity?.identityId)) {
      return false;
    }

    if (scope?.includes('soulname') && (soulnames?.length ?? 0) === 0) {
      return false;
    }

    if (scope?.includes('auth') && !isLoggedIn) {
      return false;
    }

    return true;
  }, [soulnames, scope, isLoggedIn, verbose]);

  return { scope, setScope, areScopesFullfiled };
};
