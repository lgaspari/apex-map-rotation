import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react';

/**
 * Reference: https://github.com/streamich/react-use/blob/325f5bd69904346788ea981ec18bfc7397c611df/src/useLocalStorage.ts
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      if (item !== null) {
        return JSON.parse(item);
      } else {
        if (initialValue) {
          localStorage.setItem(key, JSON.stringify(initialValue));
        }
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  const setStorageValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      try {
        if (value instanceof Function) {
          setValue((prevValue) => {
            const result = value(prevValue);
            localStorage.setItem(key, JSON.stringify(result));
            return result;
          });
        } else {
          localStorage.setItem(key, JSON.stringify(value));
          setValue(value);
        }
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, setValue]
  );

  return [value, setStorageValue] as const;
}
