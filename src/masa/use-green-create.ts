import { useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useGreenGenerate = () => {
  const { masa } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [{ loading: isCreatingGreen, error: createGreenError }, createGreen] =
    useAsyncFn(
      async (phoneNumber: string, code: string) => {
        try {
          const response = await masa?.green.create('ETH', phoneNumber, code);
          await queryClient.invalidateQueries({
            queryKey: ['green'],
          });
          return response ?? null;
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message);
            throw error;
          }

          throw new Error('Unknown error while creating a green');
        }
      },
      [masa, queryClient]
    );
  const [
    { loading: isGeneratingGreen, error: generateGreenError },
    generateGreen,
  ] = useAsyncFn(
    async (phoneNumber: string) => {
      try {
        const response = await masa?.green.generate(phoneNumber);
        return response ?? null;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          throw error;
        }

        throw new Error('Unknown error while generating a green');
      }
    },
    [masa]
  );

  return {
    isCreatingGreen,

    createGreen,
    handleCreateGreen: createGreen,
    createGreenError,

    handleGenerateGreen: generateGreen,
    isGeneratingGreen,
    generateGreenError,
    generateGreen,
  };
};
