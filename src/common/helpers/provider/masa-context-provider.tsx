import React, { createContext } from 'react';

export const MASA_TOOLS_CONTEXT = createContext<MasaToolsShape>({});

interface MasaContextProviderProps extends MasaToolsShape {
  children: React.ReactNode;
}

export interface MasaToolsShape {
  rest?: any;
  apiURL?: string;
}

export const MasaContextProvider = ({
  children,
  apiURL,
  rest,
}: MasaContextProviderProps) => {
  const context = { rest, apiURL };

  return (
    <MASA_TOOLS_CONTEXT.Provider value={context}>
      {children}
    </MASA_TOOLS_CONTEXT.Provider>
  );
};
