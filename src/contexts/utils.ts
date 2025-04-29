const currencies = ["USD", "GBP", "CAD", "AUD", "JPY", "BRL", "EUR"] as const;
export type Currency = (typeof currencies)[number];
export function get_currencies(): readonly Currency[] {
  return currencies;
}

const themes = ["Neutral", "Slate"] as const;
export type Themes = (typeof themes)[number];
export function get_themes(): readonly Themes[] {
  return themes;
}

