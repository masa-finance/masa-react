export const useLocalStorage = () => {
  const localStorageGet = <T>(key: string): T | undefined => {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : undefined;
  };

  const localStorageSet = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return {
    localStorageGet,
    localStorageSet,
  };
};
