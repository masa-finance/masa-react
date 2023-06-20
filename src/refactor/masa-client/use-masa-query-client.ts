import { useQueryClient } from '@tanstack/react-query';
import { useClient } from 'wagmi';
import { QcContext } from '../masa-provider';

export const useMasaQueryClient = () => {
  const queryClient = useQueryClient({ context: QcContext });
  const client = useClient();

  console.log('wagmiclient', { client });

  return queryClient;
};
