import type { League } from "@commander-league/contract/schemas";
import * as repo from "../repository/";
import db from "../db";
import { createMember } from "./member";

export function getLeague(): League {
  const settings = repo.getLeagueSettings();

  if (!settings) return { initialized: false };

  return { initialized: true, settings };
}

export function initializeLeague({
  name,
  ownerId,
}: {
  name: string;
  ownerId: string;
}) {
  db.transaction((tx) => {
    createMember({ userId: ownerId, admin: true }, tx);
    repo.insertLeagueSettings({ name, ownerId }, tx);
  });
}
