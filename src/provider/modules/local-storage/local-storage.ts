interface LocalStorageContextValues {
  get: (key: string) => string | null;
  save: (key: string, value: string | number) => void;
  remove: (key: string) => void;
}

const get = (key: string): string | null => {
  return localStorage.getItem(key);
};

const save = (key: string, value: string | number): void => {
  localStorage.setItem(key, JSON.stringify({ value }));
};

const remove = (key: string): void => {
  localStorage.removeItem(key);
};

export const useLocalStorage = () => {
  return {
    get,
    save,
    remove,
  };
};
