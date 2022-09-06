import { ethers } from 'ethers';
import { loadContracts } from '../src/index';

describe('Contracts', () => {
  let provider;

  beforeAll(() => {
    provider = new ethers.providers.JsonRpcProvider(
      'https://alfajores-forno.celo-testnet.org'
    );
  });

  it('should load contracts', async () => {
    const contracts = await loadContracts({ provider });
    expect(contracts.SoulboundIdentityContract).toBeDefined();
    expect(contracts.SoulboundCreditReportContract).toBeDefined();
  });

  it('should display contracts addresses properly', async () => {
    const contracts = await loadContracts({ provider });
    console.log(
      'SoulboundIdentityContract Address',
      contracts.SoulboundIdentityContract.address
    );
    console.log(
      'SoulboundCreditReportContract Address',
      contracts.SoulboundCreditReportContract.address
    );
  });
});
