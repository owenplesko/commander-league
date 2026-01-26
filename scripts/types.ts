export type CardAtomic = {
  asciiName?: string;
  attractionLights?: number[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  convertedManaCost: number;
  defense?: string;
  edhrecRank?: number;
  edhrecSaltiness?: number;
  faceConvertedManaCost?: number;
  faceManaValue?: number;
  faceName?: string;
  firstPrinting?: string;
  foreignData?: ForeignData[];
  hand?: string;
  hasAlternativeDeckLimit?: boolean;
  identifiers: Identifiers;
  isFunny?: boolean;
  isGameChanger?: boolean;
  isReserved?: boolean;
  keywords?: string[];
  layout: string;
  leadershipSkills?: LeadershipSkills;
  legalities: Legalities;
  life?: string;
  loyalty?: string;
  manaCost?: string;
  manaValue: number;
  name: string;
  power?: string;
  printings?: string[];
  purchaseUrls: PurchaseUrls;
  relatedCards: RelatedCards;
  rulings?: Rulings[];
  side?: string;
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
};

export type ForeignData = {
  faceName?: string;
  flavorText?: string;
  identifiers: Identifiers;
  language: string;
  name: string;
  text?: string;
  type?: string;
  uuid: string;
};

export type Identifiers = {
  abuId?: string;
  cardKingdomEtchedId?: string;
  cardKingdomFoilId?: string;
  cardKingdomId?: string;
  cardsphereId?: string;
  cardsphereFoilId?: string;
  cardtraderId?: string;
  csiId?: string;
  mcmId?: string;
  mcmMetaId?: string;
  miniaturemarketId?: string;
  mtgArenaId?: string;
  mtgjsonFoilVersionId?: string;
  mtgjsonNonFoilVersionId?: string;
  mtgjsonV4Id?: string;
  mtgoFoilId?: string;
  mtgoId?: string;
  multiverseId?: string;
  scgId?: string;
  scryfallId?: string;
  scryfallCardBackId?: string;
  scryfallOracleId?: string;
  scryfallIllustrationId?: string;
  tcgplayerProductId?: string;
  tcgplayerEtchedProductId?: string;
  tntId?: string;
};

export type LeadershipSkills = {
  brawl: boolean;
  commander: boolean;
  oathbreaker: boolean;
};

export type Legalities = {
  alchemy?: string;
  brawl?: string;
  commander?: string;
  duel?: string;
  explorer?: string;
  future?: string;
  gladiator?: string;
  historic?: string;
  historicbrawl?: string;
  legacy?: string;
  modern?: string;
  oathbreaker?: string;
  oldschool?: string;
  pauper?: string;
  paupercommander?: string;
  penny?: string;
  pioneer?: string;
  predh?: string;
  premodern?: string;
  standard?: string;
  standardbrawl?: string;
  timeless?: string;
  vintage?: string;
};

export type PurchaseUrls = {
  cardKingdom?: string;
  cardKingdomEtched?: string;
  cardKingdomFoil?: string;
  cardmarket?: string;
  tcgplayer?: string;
  tcgplayerEtched?: string;
};

export type RelatedCards = {
  reverseRelated?: string[];
  spellbook?: string[];
};

export type Rulings = {
  date: string;
  text: string;
};
