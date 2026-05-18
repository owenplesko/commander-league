import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { CollectionBulkEditModal } from "./CollectionBulkEdit";
import { useRef, useState } from "react";
import type { MenuItem } from "primereact/menuitem";
import { PrimeIcons } from "primereact/api";

export function CollectionSettings({ userId }: { userId: string }) {
  const menuRef = useRef<Menu>(null);
  const [visible, setVisible] = useState(false);

  const menuOptions: MenuItem[] = [
    { label: "Bulk Edit", command: () => setVisible(true) },
  ];

  return (
    <>
      <Button
        icon={PrimeIcons.COG}
        text
        onClick={(e) => menuRef.current?.toggle(e)}
      />
      <Menu ref={menuRef} model={menuOptions} popup />
      <CollectionBulkEditModal
        userId={userId}
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </>
  );
}
