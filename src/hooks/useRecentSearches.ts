import { useCallback, useMemo, useState } from "react";
import { type } from "arktype";

const RecentSearches = type("string[]");

const DEFAULT_MAX_SEARCHES = 10;

const readFromStorage = (storageKey: string): string[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const storedValue = window.localStorage.getItem(storageKey);
  if (storedValue === null) {
    return [];
  }
  try {
    const parsedValue = RecentSearches(JSON.parse(storedValue));
    if (!(parsedValue instanceof type.errors)) {
      return parsedValue.filter((value): value is string => typeof value === "string");
    }
    return [];
  } catch {
    return [];
  }
};

const writeToStorage = (storageKey: string, searches: string[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify(searches));
};

export const useRecentSearches = (
  storageKey: string,
  maxSearches: number = DEFAULT_MAX_SEARCHES
) => {
  const sanitizedMax = useMemo(() => {
    return maxSearches > 0 ? Math.floor(maxSearches) : DEFAULT_MAX_SEARCHES;
  }, [maxSearches]);

  const [searches, setSearches] = useState<string[]>(() => {
    const storedSearches = readFromStorage(storageKey);
    return storedSearches.slice(0, sanitizedMax);
  });

  const addSearch = useCallback(
    (search: string) => {
      setSearches((previousSearches) => {
        const trimmedSearch = search.trim();
        if (trimmedSearch.length === 0) {
          return previousSearches;
        }
        const existingIndex = previousSearches.indexOf(trimmedSearch);
        const withoutExisting =
          existingIndex === -1
            ? previousSearches
            : previousSearches.filter((existingSearch) => existingSearch !== trimmedSearch);
        const nextSearches = [trimmedSearch, ...withoutExisting].slice(0, sanitizedMax);
        writeToStorage(storageKey, nextSearches);
        return nextSearches;
      });
    },
    [sanitizedMax, storageKey]
  );

  const removeSearch = useCallback(
    (search: string) => {
      setSearches((previousSearches) => {
        const nextSearches = previousSearches.filter((existingSearch) => existingSearch !== search);
        writeToStorage(storageKey, nextSearches);
        return nextSearches;
      });
    },
    [storageKey]
  );

  return { searches, addSearch, removeSearch };
};
