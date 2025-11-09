import { fetchMove } from "@/lib/endpoints";
import { Move, MoveDetails, validateMoveDetails } from "@/lib/pokemonValidation";
import { useState } from "react";

export const Moves = ({ moves }: { moves: Move[] }) => {
  const [moveDetails, setMoveDetails] = useState<MoveDetails | null>(null);
  return (
    <div className="flex gap-2 flex-col">
      <h2 className="text-lg font-bold">
        Moves <span className="text-xs text-gray-500">(scroll to see all)</span>
      </h2>
      <ul className="h-44 overflow-y-auto">
        {moves.map((move) => (
          <MoveItem key={move.move.name} move={move} onSelectMove={setMoveDetails} />
        ))}
      </ul>
      <p className="text-sm text-gray-500">Hover over a move to see its description</p>
      <p className="w-60">
        {
          moveDetails?.effect_entries.filter((entry) => entry.language.name === "en")?.[0]
            ?.short_effect
        }
      </p>
    </div>
  );
};

interface MoveItemProps {
  move: Move;
  onSelectMove: (moveDetails: MoveDetails | null) => void;
}

const MoveItem = ({ move, onSelectMove }: MoveItemProps) => {
  const handleMouseEnter = async (moveUrl: string) => {
    const moveDetails = await fetchMove(moveUrl);
    const validatedMoveDetails = validateMoveDetails(moveDetails);
    onSelectMove(validatedMoveDetails);
  };
  return (
    <li
      key={move.move.name}
      className="hover:underline"
      onMouseEnter={() => handleMouseEnter(move.move.url)}
      onMouseLeave={() => onSelectMove(null)}
    >
      {move.move.name}
    </li>
  );
};
