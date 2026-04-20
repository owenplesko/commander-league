import type { Card } from "@commander-league/contract/schemas";
import { useEffect, useState } from "react";
import { scryfallImgUrl } from "../lib/utils";

type Props = { card: Card | undefined };
export function HoverCard({ card }: Props) {
  const [{ x, y }, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!card) return null;

  return (
    <img
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${x + 32}px, ${y - 48}px)`,
        pointerEvents: "none",
        height: "300px",
      }}
      src={scryfallImgUrl(card?.data.printings[0]?.scryfallId ?? null)}
    />
  );
}
