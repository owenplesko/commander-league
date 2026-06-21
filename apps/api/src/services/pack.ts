import * as repo from "../repository";

export const listPacks = repo.listPacks;

export const setPackOfferings = repo.setPackOfferings;

export const listPackOfferings = repo.listPackOfferings;

export function filterInvalidPackIds({ packIds }: { packIds: string[] }) {
  const valid = repo.filterExistingPackIds({ packIds });
  const validSet = new Set(valid);

  const invalid = packIds.filter((id) => !validSet.has(id));

  return invalid;
}
