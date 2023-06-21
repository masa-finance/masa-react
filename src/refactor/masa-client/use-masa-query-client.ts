import { useQueryClient } from '@tanstack/react-query';
import { MasaQueryClientContext } from '../provider/masa-state-provider';

export const useMasaQueryClient = () => {
  const queryClient = useQueryClient({ context: MasaQueryClientContext });
  return queryClient;
};
