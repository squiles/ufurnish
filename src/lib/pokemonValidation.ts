import { type } from "arktype";

const Move = type({
  move: {
    name: "string",
    url: "string",
  },
  version_group_details: type({
    level_learned_at: "number",
    move_learn_method: type({
      name: "string",
      url: "string",
    }),
    version_group: type({
      name: "string",
      url: "string",
    }),
  }).array(),
});

export type Move = typeof Move.infer;

export const Ability = type({
  ability: {
    name: "string",
    url: "string",
  },
  is_hidden: "boolean",
  slot: "number",
});
export type Ability = typeof Ability.infer;

export const PokemonResponse = type({
  name: "string",
  sprites: {
    front_default: "string",
  },
  base_experience: "number",
  abilities: Ability.array(),
  moves: Move.array(),
});

export type PokemonResponse = typeof PokemonResponse.infer;

export const validatePokemon = (data: unknown) => {
  const out = PokemonResponse(data);
  if (out instanceof type.errors) {
    console.error(out);
    throw new Error("Invalid pokemon data");
  }
  return out;
};

export const AbilityDetails = type({
  effect_entries: type({
    effect: "string",
    language: type({
      name: "string",
      url: "string",
    }),
    short_effect: "string",
  }).array(),
});

export type AbilityDetails = typeof AbilityDetails.infer;

export const validateAbilityDetails = (data: unknown) => {
  const out = AbilityDetails(data);
  if (out instanceof type.errors) {
    console.error(out);
    throw new Error("Invalid ability details");
  }
  return out;
};

export const MoveDetails = type({
  effect_entries: type({
    effect: "string",
    language: type({
      name: "string",
      url: "string",
    }),
    short_effect: "string",
  }).array(),
});

export type MoveDetails = typeof MoveDetails.infer;

export const validateMoveDetails = (data: unknown) => {
  const out = MoveDetails(data);
  if (out instanceof type.errors) {
    console.error(out);
    throw new Error("Invalid move details");
  }
  return out;
};
