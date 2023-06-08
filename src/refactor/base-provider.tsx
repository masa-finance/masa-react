import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { SupportedNetworks } from '@masa-finance/masa-sdk';
import { MasaReactConfig } from './config';

export interface MasaReactConfigBaseProvider extends MasaReactConfig {
  updateConfig: (newConfig: Partial<MasaReactConfig>) => void;
  SupportedNetworks: typeof SupportedNetworks;
}

export const MasaBaseContext = createContext({} as MasaReactConfigBaseProvider);

export const MasaBaseProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: MasaReactConfig;
}) => {
  console.log('provider param', { config });
  const [masaConfig, setConfig] = useState<MasaReactConfig>(config);

  const updateConfig = useCallback(
    (newConfig: Partial<MasaReactConfig>) => {
      setConfig((prevConfig: MasaReactConfig) => ({
        ...prevConfig,
        ...newConfig,
      }));
    },
    [setConfig]
  );

  const masaBaseProviderValue = useMemo(
    () =>
      ({
        ...masaConfig,
        SupportedNetworks,
        updateConfig,
      } as MasaReactConfigBaseProvider),
    [masaConfig, updateConfig]
  );

  return (
    <MasaBaseContext.Provider value={masaBaseProviderValue}>
      {children}
    </MasaBaseContext.Provider>
  );
};

export const useConfig = (): MasaReactConfigBaseProvider => useContext(MasaBaseContext);
export default MasaBaseProvider;
