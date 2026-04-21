import classes from "../styles/Table.module.css";
import type { Card } from "@commander-league/contract/schemas";
import { useState } from "react";
import type { CardGroup } from "../types/cardGrouping";
import { useToggleSet } from "../hooks/useToggleSet";
import { PrimeIcons } from "primereact/api";
import { HoverCard } from "./HoveredCard";
import { useBinFilling } from "../hooks/useBinFilling";

export function Body({ cardGroups }: { cardGroups: CardGroup[] }) {
  const columns = 4;
  const [hoveredCard, setHoveredCard] = useState<Card>();
  const { isToggled: isCollapsed, toggle } = useToggleSet();
  const groupBins = useBinFilling({
    items: cardGroups,
    binsCount: columns,
    height: (group) => group.entries.length + 1,
  });

  return (
    <>
      <div
        className={classes.contentBinContainer}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {groupBins.map((bin) => (
          <div className={classes.contentBin}>
            {bin.map(({ id, header, entries }) => (
              <div>
                <div className={classes.groupHeader} onClick={() => toggle(id)}>
                  {header()}
                  <span>{`(${entries.length})`}</span>
                  <i
                    style={{ marginLeft: "auto" }}
                    className={
                      isCollapsed(id)
                        ? PrimeIcons.CHEVRON_DOWN
                        : PrimeIcons.CHEVRON_UP
                    }
                  />
                </div>
                <div
                  className={`${classes.groupContent} ${isCollapsed(id) ? classes.collapsed : ""}`}
                >
                  <ul>
                    {entries.map(({ quantity, card }) => (
                      <li key={card.name} className={classes.listSeparator}>
                        <div
                          className={classes.item}
                          onMouseEnter={() => setHoveredCard(card)}
                          onMouseLeave={() => setHoveredCard(undefined)}
                        >
                          <span className={classes["text-ellipsis"]}>
                            {`${quantity} ${card.name}`}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <HoverCard card={hoveredCard} />
    </>
  );
}
