import { useQueryClient } from '@tanstack/react-query';
import { queryClient } from './query-client';

export const useMasaQueryClient = () => {
  return useQueryClient(queryClient);
};
