import { fetchAbility } from "@/lib/endpoints";
import { Ability, AbilityDetails, validateAbilityDetails } from "@/lib/pokemonValidation";
import { useState } from "react";

export const Abilities = ({ abilities }: { abilities: Ability[] }) => {
  const [abilityDetails, setAbilityDetails] = useState<AbilityDetails | null>(null);

  return (
    <div className="flex gap-2 flex-col">
      <h2 className="text-lg font-bold">Abilities</h2>
      <ul className="h-44 overflow-y-auto">
        {abilities.map((ability) => (
          <AbilityItem
            key={ability.ability.name}
            ability={ability}
            onSelectAbility={setAbilityDetails}
          />
        ))}
      </ul>
      <p className="text-sm text-gray-500">Hover over an ability to see its effect</p>
      <p className="w-60">
        {
          abilityDetails?.effect_entries.filter((entry) => entry.language.name === "en")?.[0]
            ?.short_effect
        }
      </p>
    </div>
  );
};

interface AbilityItemProps {
  ability: Ability;
  onSelectAbility: (abilityDetails: AbilityDetails | null) => void;
}

const AbilityItem = ({ ability, onSelectAbility }: AbilityItemProps) => {
  const handleMouseEnter = async (abilityUrl: string) => {
    const abilityDetails = await fetchAbility(abilityUrl);
    const validatedAbilityDetails = validateAbilityDetails(abilityDetails);
    onSelectAbility(validatedAbilityDetails);
  };

  return (
    <li
      key={ability.ability.name}
      className="hover:underline cursor-pointer relative"
      onMouseEnter={() => handleMouseEnter(ability.ability.url)}
      onMouseLeave={() => onSelectAbility(null)}
    >
      {ability.ability.name}
    </li>
  );
};
