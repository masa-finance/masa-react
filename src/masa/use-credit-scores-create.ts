import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client';

export const useCreditScoreCreate = () => {
  const { masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [
    { loading: isCreatingCreditScore, error: errorCreditScoreCrate },
    createCreditScore,
  ] = useAsyncFn(async () => {
    try {
      const response = await masa?.creditScore.create();
      await queryClient.invalidateQueries({
        queryKey: ['credit-scores'],
      });
      return response?.success;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        throw error;
      }

      throw new Error('Unknown error while creating a credit score');
    }
  }, [masa, queryClient]);

  return {
    createCreditScore,
    isCreatingCreditScore,
    errorCreditScoreCrate,
    handleCreateCreditScore: createCreditScore,
  };
};
