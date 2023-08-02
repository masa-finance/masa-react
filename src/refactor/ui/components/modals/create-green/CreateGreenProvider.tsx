import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface CreateGreenProviderValue {
  phoneNumberContext: string | undefined;
  setPhoneNumberContext: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export const CreateGreenContext = createContext({} as CreateGreenProviderValue);

export const CreateGreenProvider = ({ children }: { children: ReactNode }) => {
  const [phoneNumberContext, setPhoneNumberContext] = useState<
    string | undefined
  >();

  const value = useMemo(
    () => ({
      phoneNumberContext,
      setPhoneNumberContext,
    }),
    [phoneNumberContext, setPhoneNumberContext]
  );
  return (
    <CreateGreenContext.Provider value={value}>
      {children}
    </CreateGreenContext.Provider>
  );
};

export const useCreateGreenModal = () => useContext(CreateGreenContext);
