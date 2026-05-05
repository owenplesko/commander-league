import { Tooltip } from "primereact/tooltip";
import { type ReactNode } from "react";
import type { Card } from "@commander-league/contract/schemas";
import { scryfallImgUrl } from "../../../lib/utils";

export function HoverCard({
  card,
  children,
}: {
  card: Card;
  children: ReactNode;
}) {
  const scryfallId = card.data.printings[0]?.scryfallId ?? null;
  const className = `card-preview-${scryfallId ?? "default"}`;
  const target = `.${className}`;

  return (
    <>
      <div className={className}>{children}</div>
      <Tooltip
        target={target}
        pt={{
          text: {
            style: { padding: 0, background: "none", boxShadow: "none" },
          },
        }}
      >
        <img
          height={300}
          width={213}
          src={scryfallImgUrl(scryfallId)}
          alt={card.name}
        />
      </Tooltip>
    </>
  );
}
