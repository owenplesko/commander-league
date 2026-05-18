import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useRef, useState } from "react";
import { EditDeckModal } from "./EditDeckModal";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/client";
import { useRouter } from "@tanstack/react-router";
import { confirmDialog } from "primereact/confirmdialog";

export function DeckOptions({ deckId }: { deckId: number }) {
  const router = useRouter();
  const menuRef = useRef<Menu>(null);
  const [visible, setVisible] = useState(false);

  const deleteMutation = useMutation(orpc.deck.delete.mutationOptions());
  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );

  const menuOptions: MenuItem[] = [
    {
      label: "Edit",
      command: () => setVisible(true),
    },
    {
      label: "Delete",
      command: () => {
        confirmDialog({
          header: "Confirmation",
          message: "Are you sure you want to delete deck?",
          icon: PrimeIcons.EXCLAMATION_TRIANGLE,
          defaultFocus: "reject",
          accept: async () => {
            await deleteMutation.mutateAsync({ deckId });
            router.navigate({
              to: "/user/$userId/decks",
              params: { userId: deck.owner.user.id },
            });
          },
        });
      },
    },
  ];

  return (
    <>
      <Button
        icon={PrimeIcons.COG}
        text
        onClick={(e) => menuRef.current?.toggle(e)}
      />
      <Menu popup model={menuOptions} ref={menuRef} />
      <EditDeckModal
        deckId={deckId}
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </>
  );
}
