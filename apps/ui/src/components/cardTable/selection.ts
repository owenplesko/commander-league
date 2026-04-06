import type { CardQuantity } from "@commander-league/contract/schemas";

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
  state: CardQuantity[],
  action: ReducerAction,
): CardQuantity[] {
  switch (action.type) {
    case "select":
      return [...state, { ...action.entry, quantity: 1 }];
    case "inc":
      return state.map((e) =>
        e.card.name === action.cardName
          ? { ...e, quantity: e.quantity + action.delta }
          : e,
      );
    case "unselect":
      return state.filter((e) => e.card.name !== action.cardName);
  }
}
