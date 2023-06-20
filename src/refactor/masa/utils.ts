import type { Masa } from '@masa-finance/masa-sdk';
import { constants } from 'ethers';

export const isIdentityContractAvailible = (masa?: Masa) => {
  if (!masa) return false;
  if (
    masa?.contracts.instances.SoulboundIdentityContract.address ===
      constants.AddressZero ||
    !masa?.contracts.instances.SoulboundIdentityContract.hasAddress
  ) {
    return false;
  }

  return true;
};
