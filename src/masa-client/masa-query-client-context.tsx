import type { QueryClient } from '@tanstack/react-query';
import React from 'react';

export const MasaQueryClientContext = React.createContext<
  QueryClient | undefined
>(undefined);
