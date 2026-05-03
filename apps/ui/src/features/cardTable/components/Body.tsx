import classes from "../styles/Table.module.css";
import type { Card } from "@commander-league/contract/schemas";
import { useRef, useState } from "react";
import type { CardGroup } from "../types/cardGrouping";
import { useToggleSet } from "../hooks/useToggleSet";
import { PrimeIcons } from "primereact/api";
import { HoverCard } from "./HoveredCard";
import { useBinFilling } from "../hooks/useBinFilling";
import { useSize } from "../hooks/useSize";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import type { MenuCard } from "../types/menuCard";
import { classNames } from "primereact/utils";

const MAX_COL_SIZE = 300;

export function Body({
  cardGroups,
  menuOptionsTemplate,
}: {
  cardGroups: CardGroup[];
  menuOptionsTemplate?: (mc: MenuCard) => MenuItem[] | null;
}) {
  const [hoveredCard, setHoveredCard] = useState<Card>();
  const [menuCard, setMenuCard] = useState<MenuCard>();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const menuRef = useRef<Menu>(null);
  const menuOptions: MenuItem[] | null =
    menuOptionsTemplate && menuCard ? menuOptionsTemplate(menuCard) : null;

  const ref = useRef<HTMLDivElement>(null);
  const { width } = useSize(ref);
  const columns = Math.floor(width / MAX_COL_SIZE) + 1;
  console.log(columns);

  const { isToggled: isCollapsed, toggle } = useToggleSet();
  const groupBins = useBinFilling({
    items: cardGroups,
    binsCount: columns,
    height: (group) => group.entries.length + 1,
  });

  return (
    <>
      <div
        ref={ref}
        className={classes.contentBinContainer}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {groupBins.map((bin) => (
          <div className={classes.contentBin}>
            {bin.map(({ id, header, entries }) => (
              <div key={id}>
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
                    {entries.map((cq) => (
                      <li key={cq.card.name} className={classes.listSeparator}>
                        <div
                          className={classes.item}
                          onMouseEnter={() => setHoveredCard(cq.card)}
                          onMouseLeave={() => setHoveredCard(undefined)}
                        >
                          <span className={classes.textEllipsis}>
                            {`${cq.quantity} ${cq.card.name}`}
                          </span>
                          <i
                            className={classNames(
                              PrimeIcons.ELLIPSIS_V,
                              classes.cardOptions,
                            )}
                            onClick={(e) => {
                              setMenuCard({ ...cq, groupId: id });
                              menuRef.current?.toggle(e);
                            }}
                          />
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
      <HoverCard card={menuVisible ? undefined : hoveredCard} />
      {menuOptions && (
        <Menu
          model={menuOptions}
          ref={menuRef}
          popup
          popupAlignment="right"
          onShow={() => setMenuVisible(true)}
          onHide={() => setMenuVisible(false)}
        />
      )}
    </>
  );
}
