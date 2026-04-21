import { useState } from "react";

export function useToggleSet() {
  const [toggleState, setToggleState] = useState(new Set<string>());

  function isToggled(id: string) {
    return toggleState.has(id);
  }

  function toggle(id: string) {
    setToggleState((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return {
    isToggled,
    toggle,
  };
}
