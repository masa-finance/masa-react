import {
  SoulboundCreditReport__factory,
  SoulboundIdentity__factory,
} from '@masa-finance/masa-contracts-identity';
import { ethers } from 'ethers';

import SoulboundIdentity from '@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundIdentity.json';
import SoulboundCreditReport from '@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundCreditReport.json';

export const loadContracts = async (provider?: any) => {
  const p =
    // take provider as is if supplied
    provider ||
    // or try to load from the browser
    new ethers.providers.Web3Provider(
      // @ts-ignore
      window.ethereum
    );

  const WEB3_IDENTITY_CONTRACT_ADDRESS = SoulboundIdentity.address;

  const SoulboundIdentityContract = SoulboundIdentity__factory.connect(
    WEB3_IDENTITY_CONTRACT_ADDRESS,
    p
  );

  console.log(
    'Total supply of SoulboundIdentity at',
    WEB3_IDENTITY_CONTRACT_ADDRESS,
    'is',
    (await SoulboundIdentityContract.totalSupply()).toString()
  );

  const WEB3_CREDIT_REPORT_CONTRACT_ADDRESS = SoulboundCreditReport.address;

  const SoulboundCreditReportContract = SoulboundCreditReport__factory.connect(
    WEB3_CREDIT_REPORT_CONTRACT_ADDRESS,
    p
  );

  console.log(
    'Total supply of SoulboundCreditReport at',
    WEB3_CREDIT_REPORT_CONTRACT_ADDRESS,
    'is',
    (await SoulboundCreditReportContract.totalSupply()).toString()
  );

  return {
    SoulboundIdentityContract,
    SoulboundCreditReportContract,
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
