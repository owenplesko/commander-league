import type { Deck } from "@commander-league/contract/schemas";
import { CardTable } from "../../cardTable/components/CardTable";
import type { CardGroup } from "../../cardTable/types/cardGrouping";
import type { MenuCard } from "../../cardTable/types/menuCard";
import type { MenuItem } from "primereact/menuitem";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../../../lib/client";

const COMMANDER_GROUP_ID = "commander";

export function DeckCardTable({
  deck,
  readonly = true,
}: {
  deck: Deck;
  readonly?: boolean;
}) {
  const commanderGroup: CardGroup = {
    id: COMMANDER_GROUP_ID,
    header: () => "Commander",
    entries: [{ card: deck.commanderCard, quantity: 1 }],
  };

  const updateQuantityMutation = useMutation(
    orpc.deck.updateCards.mutationOptions(),
  );

  function menuOptionsTemplate({
    quantity,
    card,
    groupId,
  }: MenuCard): MenuItem[] | null {
    if (readonly) return null;

    if (groupId === COMMANDER_GROUP_ID) return null;

    return [
      {
        label: "Add One",
        async command() {
          await updateQuantityMutation.mutateAsync({
            deckId: deck.id,
            cardDeltas: [{ cardName: card.name, quantity: 1 }],
          });
        },
      },
      {
        label: "Remove One",
        async command() {
          await updateQuantityMutation.mutateAsync({
            deckId: deck.id,
            cardDeltas: [{ cardName: card.name, quantity: -1 }],
          });
        },
      },
    ];
  }

  return (
    <CardTable
      pinnedGroups={[commanderGroup]}
      cardQuantities={deck.cardQuantities}
      menuOptionsTemplate={menuOptionsTemplate}
    />
  );
}
