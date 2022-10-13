import React, { createContext } from 'react';

export const MASA_TOOLS_CONTEXT = createContext<MasaToolsShape>({});

export interface MasaToolsShape {
  apiURL?: string;
}

export interface MasaContextProviderProps {
  children: React.ReactNode;
  apiURL?: string;
  rest?: any;
}

export function MasaContextProvider({
  children,
  apiURL,
  rest,
}: MasaContextProviderProps) {
  const context = { rest, apiURL };

  return (
    <MASA_TOOLS_CONTEXT.Provider value={context}>
      {children}
    </MASA_TOOLS_CONTEXT.Provider>
  );
}
