import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useRef, useState } from "react";

const RECENT_SEARCHES_STORAGE_KEY = "recent-searches";
const DEFAULT_MAX_RECENT_SEARCHES = 5;

interface Props {
  error: string | null;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const SearchPokemon = (props: Props) => {
  const { error, handleSearch } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [search, setSearch] = useState("");
  const { searches, addSearch } = useRecentSearches(
    RECENT_SEARCHES_STORAGE_KEY,
    DEFAULT_MAX_RECENT_SEARCHES
  );

  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("pokemon") as string;
    if (!name || name.trim() === "") {
      return;
    }
    addSearch(name);
    setShowRecentSearches(false);
    handleSearch(e);
  };

  const handleRecentSearchClick = (searchItem: string) => {
    setSearch(searchItem);
  };

  return (
    <form ref={formRef} className="flex gap-2 relative" onSubmit={handleSubmit}>
      <input
        className="border border-gray-300 rounded-md p-2 w-48"
        type="text"
        name="pokemon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowRecentSearches(true)}
        onClick={() => setShowRecentSearches(true)}
        onBlur={() => setTimeout(() => setShowRecentSearches(false), 100)}
        placeholder="Search for a pokemon"
        autoComplete="off"
        aria-invalid={Boolean(error)}
      />
      {showRecentSearches && searches.length > 0 && (
        <ul
          id="recent-searches"
          className="absolute top-full left-0 bg-background shadow-md rounded-md p-2 w-48 mt-2 border border-gray-300"
        >
          {searches.map((searchItem) => (
            <li
              key={searchItem}
              className="hover:underline cursor-pointer"
              onClick={() => handleRecentSearchClick(searchItem)}
            >
              {searchItem}
            </li>
          ))}
        </ul>
      )}
      <button
        className="bg-blue-500 text-white rounded-md p-2 cursor-pointer hover:bg-blue-600"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};
