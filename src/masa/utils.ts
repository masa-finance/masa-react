import type { Masa } from '@masa-finance/masa-sdk';
import { constants } from 'ethers';

export const isIdentityContractAvailible = (masa?: Masa) => {
  const hasMasa = !!masa;
  const contractIsAddressZero =
    masa?.contracts.instances.SoulboundIdentityContract.address ===
    constants.AddressZero;
  const contractHasAddress =
    masa?.contracts.instances.SoulboundIdentityContract.hasAddress;

  return hasMasa && !contractIsAddressZero && contractHasAddress;
};
