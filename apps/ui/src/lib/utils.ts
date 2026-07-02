import type { ReactNode } from "react";

export function scryfallImgUrl(scryfallId: string | null) {
  if (!scryfallId) return "https://cards.scryfall.io/back.png";

  const fileFace: string = "front";
  const fileType: string = "png";
  const fileFormat: string = "png";
  const fileName: string = scryfallId;
  const dir1: string = fileName.charAt(0);
  const dir2: string = fileName.charAt(1);
  const image: string = `https://cards.scryfall.io/${fileType}/${fileFace}/${dir1}/${dir2}/${fileName}.${fileFormat}`;
  return image;
}

export function scryfallArtCropUrl(scryfallId: string | null) {
  if (!scryfallId) return "https://cards.scryfall.io/back.png";

  const fileFace: string = "front";
  const fileType: string = "art_crop";
  const fileFormat: string = "jpg";
  const fileName: string = scryfallId;
  const dir1: string = fileName.charAt(0);
  const dir2: string = fileName.charAt(1);
  const image: string = `https://cards.scryfall.io/${fileType}/${fileFace}/${dir1}/${dir2}/${fileName}.${fileFormat}`;
  return image;
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

export function randRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function repeat<T extends () => ReactNode>(
  fn: T,
  n: number,
): ReactNode[] {
  let arr = [];
  for (let i = 0; i < n; i++) arr.push(fn());
  return arr;
}
