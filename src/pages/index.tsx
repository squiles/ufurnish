import { useState } from "react";
import Image from "next/image";

import { ImageSkeleton } from "@/components/ImageSkeleton";
import { LineSkeleton } from "@/components/LineSkeleton";

import { PokemonResponse, validatePokemon } from "@/lib/pokemonValidation";
import { fetchPokemon } from "@/lib/endpoints";
import Link from "next/link";
import dynamic from "next/dynamic";

const SearchPokemon = dynamic(
  () => import("@/components/SearchPokemon").then((mod) => mod.SearchPokemon),
  { ssr: false }
);

export default function Home() {
  const [result, setResult] = useState<PokemonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("pokemon") as string;
      if (!name || name.trim() === "") {
        return;
      }
      const response = await fetchPokemon(name);
      const out = validatePokemon(response);
      setResult(out);
    } catch {
      setError("Failed to fetch the pokemon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center pt-10 gap-4">
      <SearchPokemon error={error} handleSearch={handleSearch} />
      <div className="flex items-center gap-2" aria-busy={isLoading}>
        <div role="status" aria-live="polite" className="sr-only">
          {isLoading && "Fetching Pokémon data"}
          {!isLoading && error && "Unable to load Pokémon data"}
          {!isLoading && !error && result && `Showing results for ${result.name}`}
          {!isLoading && !error && !result && "Search for a Pokémon to see details"}
        </div>
        {!isLoading && error && (
          <div className="py-11" id="fetching-error" role="alert">
            There was an error fetching the pokemon, make sure the name is correct
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-2" role="status" aria-live="polite">
            <ImageSkeleton className="w-32 h-32" />
            <LineSkeleton className="w-32 h-4" />
          </div>
        )}
        {!isLoading && result && (
          <Image src={result.sprites.front_default} alt={result.name} width={128} height={128} />
        )}
        {result && (
          <Link
            prefetch
            href={`/pokemon/${result.name}`}
            className="text-2xl font-bold capitalize hover:underline"
          >
            {result.name}
          </Link>
        )}
      </div>
    </div>
  );
}
