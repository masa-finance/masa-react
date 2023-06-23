import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useGreenGenerate = () => {
  const { sdk: masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [{ loading: isCreatingGreen }, createGreen] = useAsyncFn(
    async (phoneNumber: string, code: string) => {
      const response = await masa?.green.create('ETH', phoneNumber, code);
      await queryClient.invalidateQueries(['green']);
      return response?.success;
    },
    [masa, queryClient]
  );
  const [{ loading: isGeneratingGreen }, generateGreen] = useAsyncFn(
    async (phoneNumber: string) => {
      const response = await masa?.green.generate(phoneNumber);
      return response?.success;
    },
    [masa]
  );

  return {
    isCreatingGreen,
    createGreen,
    isGeneratingGreen,
    generateGreen,
  };
};
