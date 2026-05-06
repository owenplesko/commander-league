export type Pack = {
  id: string;
  name: string;
  structures: PackStructure[];
  cardPools: Record<string, CardPool>;
};

export type PackStructure = {
  weight: number;
  slots: Record<string, number>;
};

export type CardPool = Record<string, number>;
