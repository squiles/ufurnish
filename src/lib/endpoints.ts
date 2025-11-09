export const fetchPokemon = async (name: string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error("Failed to fetch the pokemon");
    }
    return await response.json();
  } catch {
    throw new Error("Failed to fetch the pokemon");
  }
};

export const fetchAbility = async (abilityUrl: string) => {
  try {
    const response = await fetch(abilityUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the ability");
    }
    return await response.json();
  } catch {
    throw new Error("Failed to fetch the ability");
  }
};

export const fetchMove = async (moveUrl: string) => {
  try {
    const response = await fetch(moveUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the move");
    }
    return await response.json();
  } catch {
    throw new Error("Failed to fetch the move");
  }
};
