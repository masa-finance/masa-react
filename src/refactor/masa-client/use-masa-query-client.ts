import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { MasaQueryClientContext } from './masa-query-client-context';

export const useMasaQueryClient = () => {
  const qClient = useQueryClient({ context: MasaQueryClientContext });
  const [queryClient] = useState(qClient);
  return queryClient;
};
