import classes from "./UserBadge.module.css";
import { Menu } from "primereact/menu";
import { authClient } from "../lib/authClient";
import { Avatar } from "primereact/avatar";
import type { User } from "better-auth";
import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";

type Props = { user: User };

export function UserBadge({ user }: Props) {
  const router = useRouter();
  const menuRef = useRef<Menu | null>(null);

  const menuItems = [
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: async () => {
        await authClient.signOut();
        await router.invalidate();
      },
    },
  ];

  return (
    <>
      <div
        className={classes["user-badge"]}
        onClick={(e) => menuRef.current?.toggle(e)}
      >
        <Avatar shape="circle" image={user.image ?? undefined} />
        {user.name}
      </div>
      <Menu popup ref={menuRef} model={menuItems} />
    </>
  );
}
