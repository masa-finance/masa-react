import {
  SoulboundIdentity__factory,
  SoulboundCreditReport__factory,
  SoulName__factory,
} from '@masa-finance/masa-contracts-identity';
import { ethers } from 'ethers';
import * as rinkeby from './rinkeby';
import * as alfajores from './alfajores';

const addresses = {
  rinkeby,
  alfajores,
};

export const loadContracts = async (provider?: any, network = 'alfajores') => {
  const p =
    // take provider as is if supplied
    provider ||
    // or try to load from the browser
    new ethers.providers.Web3Provider(
      // @ts-ignore
      window.ethereum
    );

  const SoulboundIdentityContract = SoulboundIdentity__factory.connect(
    addresses[network].SoulboundIdentityAddress,
    p
  );

  console.log(
    'Total supply of SoulboundIdentity at',
    addresses[network].SoulboundIdentityAddress,
    'is',
    (await SoulboundIdentityContract.totalSupply()).toString()
  );

  const SoulboundCreditReportContract = SoulboundCreditReport__factory.connect(
    addresses[network].SoulboundCreditReportAddress,
    p
  );

  console.log(
    'Total supply of SoulboundCreditReport at',
    addresses[network].SoulboundCreditReportAddress,
    'is',
    (await SoulboundCreditReportContract.totalSupply()).toString()
  );

  const SoulNameContract = SoulName__factory.connect(
    addresses[network].SoulNameAddress,
    p
  );

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
