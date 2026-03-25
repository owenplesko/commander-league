import type { CardQuantity } from "@commander-league/contract/schemas";

export type SelectedCard = CardQuantity & { selectedQuantity: number };

type ReducerAction =
  | {
      type: "select";
      entry: CardQuantity;
    }
  | {
      type: "inc";
      cardName: string;
      delta: number;
    }
  | {
      type: "unselect";
      cardName: string;
    };

export function selectedCardsReducer(
  state: SelectedCard[],
  action: ReducerAction,
): SelectedCard[] {
  switch (action.type) {
    case "select":
      return [...state, { ...action.entry, selectedQuantity: 1 }];
    case "inc":
      return state.map((e) =>
        e.card.name === action.cardName
          ? { ...e, selectedQuantity: e.selectedQuantity + action.delta }
          : e,
      );
    case "unselect":
      return state.filter((e) => e.card.name !== action.cardName);
  }
}
