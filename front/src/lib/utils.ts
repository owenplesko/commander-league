export function scryfallImgUrl(scryfallId: string) {
  const fileFace: string = "front";
  const fileType: string = "large";
  const fileFormat: string = "jpg";
  const fileName: string = scryfallId;
  const dir1: string = fileName.charAt(0);
  const dir2: string = fileName.charAt(1);
  const image: string = `https://cards.scryfall.io/${fileType}/${fileFace}/${dir1}/${dir2}/${fileName}.${fileFormat}`;
  return image;
}
