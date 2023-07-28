import React, { useCallback, useState } from 'react';
/* import { MasaLoading } from '../../masa-loading'; */
/* import { useCreditScores } from '../../../../masa/use-credit-scores'; */
import NiceModal from '@ebay/nice-modal-react';
import { useCreditScoreCreate } from '../../../../masa/use-credit-scores-create';
/* import { useIdentity } from '../../../../masa/use-identity'; */

import { Modal } from '../modal';

export const CreateCreditScoreModal = NiceModal.create((): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  /* const { creditScores, isLoadingCreditScores: isLoading } = useCreditScores(); */
  const { handleCreateCreditScore } = useCreditScoreCreate();
  /* const { identity } = useIdentity(); */

  /* const showCreditScoreCreation =
   *   identity && !creditScores?.length && scope?.includes('credit-score');
   */
  const createCreditScore = useCallback(async () => {
    setError(null);
    const minted: boolean | undefined = await handleCreateCreditScore?.();

    if (!minted)
      setError('There is not enough data for generating a credit score');
  }, []);

  /* if (isLoading) return <MasaLoading />; */

  return (
    <Modal>
      <section className="interface-create-identity">
        <div>
          <h3>Your identity does not have a credit score</h3>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p>Generate your credit score!</p>
          )}
        </div>
        <div>
          <button
            type="button"
            className="masa-button"
            onClick={createCreditScore}
          >
            Create now!
          </button>
          <div className="dont-have-a-wallet">
            <p>I don&apos;t want to use this wallet</p>
          </div>
        </div>
      </section>
    </Modal>
  );
});
