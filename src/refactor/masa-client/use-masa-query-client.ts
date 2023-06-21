import { useQueryClient } from '@tanstack/react-query';
import { QcContext } from '../masa-provider';

export const useMasaQueryClient = () => {
  const queryClient = useQueryClient({ context: QcContext });

  return queryClient;
};
