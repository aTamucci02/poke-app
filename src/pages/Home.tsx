import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Autocomplete,
} from "@mui/material";
import { useDataProvider } from "@refinedev/core";
import names from "../data/pokemon-names.json";
import { sanitizeName } from "../utils/SanitizeEntry";

interface Pokemon {
  id: string;
  name: string;
  sprites?: { front_default?: string };
  types?: { type: { name: string } }[];
}

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataProvider = useDataProvider()();

  const options = useMemo(() => {
    const term = inputValue.trim().toLowerCase();
    if (!term) return names;
    return names.filter((n: string) => n.toLowerCase().includes(term));
  }, [inputValue]);

  const handleSearch = async (name: string) => {
    try {
      const { data } = await dataProvider.getOne<Pokemon>({
        resource: "pokemon",
        id: name.toLowerCase(),
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
        <Autocomplete
          freeSolo
          disableClearable
          options={options}
          inputValue={inputValue}
          onInputChange={(_, v) => setInputValue(v)}
          onChange={(_, v) => v && handleSearch(v)}
          getOptionLabel={(option) => sanitizeName(option)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Pokémon"
              sx={{ minWidth: 240 }}
            />
          )}
          sx={{ flex: 1 }}
        />

        <Button
          variant="contained"
          onClick={() => handleSearch(inputValue)}
          disabled={!inputValue}
        >
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
