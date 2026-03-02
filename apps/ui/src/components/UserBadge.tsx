import type { User } from "@commander-league/contract/schemas";
import classes from "./UserBadge.module.css";
import { Avatar } from "primereact/avatar";

type Props = { user: User };

export function UserBadge({ user }: Props) {
  return (
    <div className={classes["user-badge"]}>
      <Avatar shape="circle" image={user.image ?? undefined} />
      {user.name}
    </div>
  );
}
