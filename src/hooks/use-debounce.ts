import { useEffect, useState } from 'react';

// Hook
export const useDebounce = (
  value: string | number,
  delay: number
): string | number => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<string | number>(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // ... within the delay period. Timeout gets cleared and restarted.
      return (): void => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
};

// Hook
export const useDebounceIfValue = (
  value: string | number,
  target: string | number,
  delay: number
): string | number => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<string | number>(value);

  useEffect(() => {
    if (value === target) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return (): void => {
        clearTimeout(handler);
      };
    }
    setDebouncedValue(value);

    return undefined;
  }, [value, delay, target]);

  return debouncedValue;
};
