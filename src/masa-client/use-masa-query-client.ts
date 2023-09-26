import { useQueryClient } from '@tanstack/react-query';
import { MasaQueryClientContext } from './masa-query-client-context';

export const useMasaQueryClient = () => {
  const queryClient = useQueryClient({ context: MasaQueryClientContext });
  return queryClient;
};
