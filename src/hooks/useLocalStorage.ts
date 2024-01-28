import { useEffect, useState } from "react";

export function useLocalStorage(
  key: string,
  defaultValue: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || defaultValue || "";
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}
