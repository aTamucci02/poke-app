export function sanitizeEntry(entry: string, pokemonName: string): string {
  if (!pokemonName) return entry;
  const asterisks = "*".repeat(pokemonName.length);
  const pattern = new RegExp(pokemonName, "gi");
  return entry.replace(pattern, asterisks);
}