import {
  SoulboundIdentity,
  SoulboundIdentity__factory,
  SoulboundCreditReport,
  SoulboundCreditReport__factory,
  SoulName,
  SoulName__factory,
  SoulLinker,
  SoulLinker__factory,
  SoulStore,
  SoulStore__factory,
} from '@masa-finance/masa-contracts-identity';
import { ethers } from 'ethers';
import * as goerli from './goerli';

const addresses = {
  goerli,
};

export interface IIdentityContracts {
  SoulboundIdentityContract: SoulboundIdentity;
  SoulboundCreditReportContract: SoulboundCreditReport;
  SoulNameContract: SoulName;
  SoulLinkerContract: SoulLinker;
  SoulStoreContract: SoulStore;
}

interface LoadContractArgs {
  provider?: any;
  network?: string;
}

export const loadContracts = async ({
  provider,
  network = 'goerli',
}: LoadContractArgs): Promise<IIdentityContracts> => {
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

  const SoulboundCreditReportContract = SoulboundCreditReport__factory.connect(
    addresses[network].SoulboundCreditReportAddress,
    p
  );

  const SoulNameContract = SoulName__factory.connect(
    addresses[network].SoulNameAddress,
    p
  );

  const SoulLinkerContract = SoulLinker__factory.connect(
    addresses[network].SoulLinkerAddress,
    p
  );

  const SoulStoreContract = SoulStore__factory.connect(
    addresses[network].SoulFactoryAddress,
    p
  );

  return {
    SoulboundIdentityContract,
    SoulboundCreditReportContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
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
