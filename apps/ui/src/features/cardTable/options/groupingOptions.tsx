import type { GroupingMethods, GroupOption } from "../types/cardGrouping";

export const groupByColor: GroupingMethods<string[]> = {
  dataAccessor: (cardQuantity) => cardQuantity.card.data.colorIdentity,
  idAccessor: (colorIdentity) => colorIdentity.join("-"),
  headerTemplate: (colorIdentity) => (
    <>
      {colorIdentity.map((color) => (
        <img
          width={18}
          height={18}
          src={`https://svgs.scryfall.io/card-symbols/${color || "C"}.svg`}
        />
      ))}
    </>
  ),
};

export const groupByRarity: GroupingMethods<string> = {
  dataAccessor: (cardQuantity) => cardQuantity.card.data.rarity,
  idAccessor: (rarity) => rarity,
  headerTemplate: (rarity) => rarity,
};

export const groupByType: GroupingMethods<string[]> = {
  dataAccessor: (cardQuantity) => cardQuantity.card.data.types,
  idAccessor: (types) => types.join("-"),
  headerTemplate: (types) => types.join(" "),
};

export const groupBySubtype: GroupingMethods<string[]> = {
  dataAccessor: (cardQuantity) => cardQuantity.card.data.subTypes,
  idAccessor: (subTypes) => subTypes.join("-"),
  headerTemplate: (subTypes) => subTypes.join(" "),
};

export const groupingOptions: GroupOption[] = [
  { label: "Color", methods: groupByColor },
  { label: "Rarity", methods: groupByRarity },
  { label: "Type", methods: groupByType },
  { label: "Subtype", methods: groupBySubtype },
];
