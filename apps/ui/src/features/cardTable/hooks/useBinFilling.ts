import { useMemo } from "react";

export function useBinFilling<T>({
  binsCount,
  items,
  height,
}: {
  binsCount: number;
  items: T[];
  height: (x: T) => number;
}): T[][] {
  return useMemo(() => {
    const binHeights = new Array(binsCount).fill(0);
    const bins: T[][] = Array.from({ length: binsCount }, () => []);
    for (const item of items) {
      const h = height(item);
      const i = minIndex(binHeights);
      bins[i]?.push(item);
      binHeights[i] += h;
    }
    return bins;
  }, [binsCount, items]);
}

/*
 returns index of smallest number in arr
 **/
export function minIndex(arr: number[]) {
  if (arr.length === 0) throw Error("cannot get min index of empty array");

  let minIndex = 0;
  for (const [i, n] of arr.entries()) {
    if (n < arr[minIndex]!) minIndex = i;
  }

  return minIndex;
}
