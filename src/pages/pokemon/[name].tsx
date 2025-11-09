import { fetchPokemon } from "@/lib/endpoints";
import { PokemonResponse, validatePokemon } from "@/lib/pokemonValidation";
import { NextApiResponse } from "next";
import Image from "next/image";
import { Abilities } from "@/components/Abilities";
import { Moves } from "@/components/Moves";

type PageProps = { data: PokemonResponse; error: null } | { error: string; data: null };

export default function Page({ data, error }: PageProps) {
  if (error !== null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">There was something wrong getting the pokemon</h1>
        <div className="text text-gray-500">{error}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-10 sm:gap-20 px-3 py-6 sm:flex-row flex-col">
      <div className="flex flex-col gap-2">
        <Image src={data.sprites.front_default} alt={data.name} width={128} height={128} />
        <h1 className="text-2xl font-bold capitalize">{data.name}</h1>
        <p className="text-sm text-gray-500">Base Experience: {data.base_experience}</p>
      </div>
      <div className="flex gap-10 sm:flex-row flex-col sm:gap-20">
        <Abilities abilities={data.abilities} />
        <Moves moves={data.moves} />
      </div>
    </div>
  );
}

type GetServerSidePropsContext = {
  params: { name: string };
  res: NextApiResponse;
};

export async function getServerSideProps({ params, res }: GetServerSidePropsContext) {
  const { name } = params;
  try {
    const response = await fetchPokemon(name);
    const data = validatePokemon(response);
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
    return { props: { data, error: null } };
  } catch (error) {
    console.error(error);
    return { props: { error: "Failed to fetch the pokemon", data: null } };
  }
}
