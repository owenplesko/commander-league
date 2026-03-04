export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
