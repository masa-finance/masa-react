import { SoulNameDetails } from '@masa-finance/masa-sdk';
import { useMemo, useState } from 'react';

export const useScopes = (
  soulnames: SoulNameDetails[],
  isLoggedIn?: boolean
) => {
  const [scope, setScope] = useState<string[]>([]);
  const areScopesFullfiled = useMemo(() => {
    if (scope?.includes('soulname') && (soulnames?.length ?? 0) === 0)
      return false;

    if (scope?.includes('auth') && !isLoggedIn) return false;

    return true;
  }, [soulnames, scope]);

  return { scope, setScope, areScopesFullfiled };
};
