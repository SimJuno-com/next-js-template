import type { SimjunoDestination } from "@next-js-template/api/types";

export const PAGE_SIZE = 18;
export const categories = [
  { key: "Country", label: "Countries" },
  { key: "Region", label: "Regions" },
  { key: "Global", label: "Global" },
] as const;

const aliases: Record<string, string[]> = {
  "united-states": ["usa", "us", "america"],
  "united-kingdom": ["uk", "great britain", "britain", "england"],
  "united-arab-emirates": ["uae", "dubai", "abu dhabi"],
  "south-korea": ["korea"],
  "czech-republic": ["czechia"],
  turkey: ["turkiye"],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// Damerau-Levenshtein also handles adjacent swapped letters (e.g. "japna").
function editDistance(left: string, right: string) {
  const rows = Array.from({ length: left.length + 1 }, (_, i) =>
    Array.from({ length: right.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i <= left.length; i++) {
    for (let j = 1; j <= right.length; j++) {
      rows[i]![j] = Math.min(
        rows[i - 1]![j]! + 1,
        rows[i]![j - 1]! + 1,
        rows[i - 1]![j - 1]! + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
        rows[i]![j] = Math.min(rows[i]![j]!, rows[i - 2]![j - 2]! + 1);
      }
    }
  }

  return rows[left.length]![right.length]!;
}

export function filterDestinations(
  destinations: readonly SimjunoDestination[],
  query: string,
): SimjunoDestination[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [...destinations];

  return destinations.filter((destination) => {
    const fields = [
      destination.name,
      destination.locationName,
      destination.slug,
      ...(aliases[destination.slug] ?? []),
    ].map(normalize);
    const words = [...new Set(fields.flatMap((field) => field.split(" ")))];

    return tokens.every((token) => {
      if (fields.some((field) => field.includes(token))) return true;
      // Keep short searches precise; allow one or two typos in longer words.
      const tolerance = token.length < 3 ? 0 : token.length < 6 ? 1 : 2;
      return (
        tolerance > 0 &&
        words.some(
          (word) =>
            Math.abs(word.length - token.length) <= tolerance &&
            editDistance(token, word) <= tolerance,
        )
      );
    });
  });
}
