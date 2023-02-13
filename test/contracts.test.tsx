import { ethers } from 'ethers';
import { loadIdentityContracts } from '@masa-finance/masa-sdk';

describe('Contracts', () => {
  let provider;

  beforeAll(() => {
    provider = new ethers.providers.JsonRpcProvider(
      'https://alfajores-forno.celo-testnet.org'
    );
  });

  it('should load contracts', async () => {
    const contracts = await loadIdentityContracts({ provider });
    expect(contracts.SoulboundIdentityContract).toBeDefined();
    expect(contracts.SoulboundCreditScoreContract).toBeDefined();
  });

  it('should display contracts addresses properly', async () => {
    const contracts = await loadIdentityContracts({ provider });
    console.log(
      'SoulboundIdentityContract Address',
      contracts.SoulboundIdentityContract.address
    );
    console.log(
      'SoulboundCreditScoreContract Address',
      contracts.SoulboundCreditScoreContract.address
    );
  });
});
