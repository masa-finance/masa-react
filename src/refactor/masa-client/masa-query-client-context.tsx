import type { QueryClient } from '@tanstack/react-query';
import React from 'react';

const undef = undefined;

export const MasaQueryClientContext = React.createContext<
  QueryClient | undefined
>(undef);
