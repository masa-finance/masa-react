import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useGreenGenerate = () => {
  const { masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [{ loading: isCreatingGreen }, createGreen] = useAsyncFn(
    async (phoneNumber: string, code: string) => {
      const response = await masa?.green.create('ETH', phoneNumber, code);
      await queryClient.invalidateQueries(['green']);
      return response ?? null;
    },
    [masa, queryClient]
  );
  const [{ loading: isGeneratingGreen }, generateGreen] = useAsyncFn(
    async (phoneNumber: string) => {
      const response = await masa?.green.generate(phoneNumber);
      return response ?? null;
    },
    [masa]
  );

  return {
    isCreatingGreen,

    handleCreateGreen: createGreen,
    handleGenerateGreen: generateGreen,
    createGreen,
    isGeneratingGreen,
    generateGreen,
  };
};
