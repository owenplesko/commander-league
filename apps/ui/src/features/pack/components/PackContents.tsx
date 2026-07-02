import { HoverCard } from "@/features/common/components/HoverCard";
import { randRange, scryfallImgUrl } from "@/lib/utils";
import type { CardQuantity } from "@commander-league/contract/schemas";
import { Dialog } from "primereact/dialog";
import { useMemo } from "react";

type Props = {
  visible: boolean;
  onHide: () => void;
  packContents: CardQuantity[];
};

export function PackContents({ visible, onHide, packContents }: Props) {
  // add stable card rotation
  const cardRotations = useMemo(
    () => packContents.map(() => randRange(-10, 10)),
    [packContents],
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      style={{ width: "60rem" }}
      draggable={false}
      resizable={false}
      modal
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {packContents.map((cq, i) => (
          <li
            key={cq.card.name}
            style={{
              opacity: 0,
              animation: "fadeIn 0.4s ease forwards",
              animationDelay: `${i * 0.1}s`,
              cursor: "pointer",
              rotate: `${cardRotations[i]}deg`,
            }}
          >
            <HoverCard card={cq.card}>
              <img
                height={200}
                width={136}
                src={scryfallImgUrl(cq.card.data.printings[0]!.scryfallId)}
              />
            </HoverCard>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
