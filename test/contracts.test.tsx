import { ethers } from 'ethers';
import { loadIdentityContracts } from '@masa-finance/masa-sdk';

describe('Contracts', () => {
  let signer;

  beforeAll(() => {
    signer = new ethers.providers.JsonRpcProvider(
      'https://alfajores-forno.celo-testnet.org'
    );
  });

  it('should load contracts', async () => {
    const contracts = await loadIdentityContracts({
      signer,
      networkName: 'alfajores',
    });
    expect(contracts.SoulboundIdentityContract).toBeDefined();
    expect(contracts.SoulboundCreditScoreContract).toBeDefined();
  });

  it('should display contracts addresses properly', async () => {
    const contracts = await loadIdentityContracts({
      signer,
      networkName: 'alfajores',
    });
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
