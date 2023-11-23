import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client';

export const useCreditScoreCreate = () => {
  const { sdk: masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [{ loading: isCreatingCreditScore }, createCreditScore] =
    useAsyncFn(async () => {
      const response = await masa?.creditScore.create();
      await queryClient.invalidateQueries({
        queryKey: ['credit-scores'],
      });
      return response?.success;
    }, [masa, queryClient]);

  return {
    createCreditScore,
    isCreatingCreditScore,
    handleCreateCreditScore: createCreditScore,
  };
};
