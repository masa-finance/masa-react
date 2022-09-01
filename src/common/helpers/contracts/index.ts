import {
  SoulboundIdentity__factory,
  SoulboundCreditReport__factory,
  SoulName__factory,
} from '@masa-finance/masa-contracts-identity';
import { ethers } from 'ethers';

import SoulboundIdentity from '@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundIdentity.json';
import SoulboundCreditReport from '@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundCreditReport.json';
import SoulName from '@masa-finance/masa-contracts-identity/deployments/alfajores/SoulName.json';

export const loadContracts = async (provider?: any) => {
  const p =
    // take provider as is if supplied
    provider ||
    // or try to load from the browser
    new ethers.providers.Web3Provider(
      // @ts-ignore
      window.ethereum
    );

  const SoulboundIdentityContract = SoulboundIdentity__factory.connect(
    SoulboundIdentity.address,
    p
  );

  console.log(
    'Total supply of SoulboundIdentity at',
    SoulboundIdentity.address,
    'is',
    (await SoulboundIdentityContract.totalSupply()).toString()
  );

  const SoulboundCreditReportContract = SoulboundCreditReport__factory.connect(
    SoulboundCreditReport.address,
    p
  );

  console.log(
    'Total supply of SoulboundCreditReport at',
    SoulboundCreditReport.address,
    'is',
    (await SoulboundCreditReportContract.totalSupply()).toString()
  );

  const SoulNameContract = SoulName__factory.connect(SoulName.address, p);

  return {
    SoulboundIdentityContract,
    SoulboundCreditReportContract,
    SoulNameContract,
  };
};

export const useContractCall = ({ method }: { method: Promise<any> }) => {
  let data;
  let error;
  let loading = true;

  method
    .then((d) => {
      data = d;
      loading = false;
    })
    .catch((e) => {
      error = e;
    });

  return {
    data,
    error,
    loading,
    getData: () => data,
  };
};
