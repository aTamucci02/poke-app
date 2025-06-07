import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useDataProvider } from "@refinedev/core";

interface Pokemon {
  id: string;
  name: string;
  sprites?: { front_default?: string };
  types?: { type: { name: string } }[];
}

const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ← call the getter to obtain the real provider
  const dataProvider = useDataProvider()();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const { data } = await dataProvider.getOne<Pokemon>({
        resource: "pokemon",
        id: query.toLowerCase(),
      });
      setPokemon(data);
      setError(null);
    } catch {
      setPokemon(null);
      setError("Pokémon not found");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Pokémon Lookup
      </Typography>

      <Box display="flex" gap={2} justifyContent="center" mb={4}>
        <TextField
          label="Name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {pokemon && (
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textTransform: "capitalize" }}
            >
              {pokemon.name}
            </Typography>
            {pokemon.sprites?.front_default && (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                width={120}
                style={{ display: "block", margin: "0 auto 16px" }}
              />
            )}
            <Typography>
              Types: {pokemon.types?.map((t) => t.type.name).join(", ")}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Home;
