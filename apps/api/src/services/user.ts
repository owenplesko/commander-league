import * as repo from "../repository/";

export const listUsers = ({ isMember }: { isMember?: boolean } = {}) => {
  if (isMember === true) return repo.listMemberUsers();

  if (isMember === false) return repo.listNonMemberUsers();

  return repo.listUsers();
};
