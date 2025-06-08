export function sanitizeEntry(entry: string, pokemonName: string): string {
  if (!pokemonName) return entry;
  const asterisks = "*".repeat(pokemonName.length);
  const pattern = new RegExp(pokemonName, "gi");
  return entry.replace(pattern, asterisks);
}

export const sanitizeName = (name: string) => {
  const noDash = name.replace(/-/g, " ");
  return noDash.charAt(0).toUpperCase() + noDash.slice(1);
};