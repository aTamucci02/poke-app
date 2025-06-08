import { mkdirSync, writeFileSync } from "fs";
import fetch from "node-fetch";

const OUT = "src/data/pokemon-names.json";
const LIMIT = 2000;

async function main() {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=0`
  );
  if (!res.ok) throw new Error(res.statusText);
  const json = await res.json();
  const names = json.results.map((p) => p.name);
  mkdirSync("src/data", { recursive: true });
  writeFileSync(OUT, JSON.stringify(names, null, 2));
  console.log(`Wrote ${names.length} names to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
