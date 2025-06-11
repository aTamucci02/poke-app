// src/pages/Translate/TranslateGame.tsx
import React, { useState, useEffect, useCallback } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useDataProvider } from "@refinedev/core";
import { sanitizeEntry } from "../../utils/SanitizeEntry";
import { useGoogleTranslate } from "../../utils/TranslateEntry";

interface SpeciesDetail {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

interface PokemonDetail {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string | null };
}

interface TranslateGameProps {
  mode: 'entry' | 'name';
  score: number;
  onNext: (correct: boolean) => void;
  onReset: () => void;
}

const TranslateGame: React.FC<TranslateGameProps> = ({
  mode,
  onNext,
  onReset,
  score,
}) => {
  const dataProvider = useDataProvider()();
  const [initialText, setInitialText] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [guess, setGuess] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(
    null
  );

  const loadPokemon = useCallback(async () => {
    setLoadingData(true);
    setGuess("");
    setFeedback("");
    setPokemonDetail(null);

    try {
      // 1) pick a random species name
      const list = await dataProvider.getList<{ name: string }>({
        resource: "pokemon-species",
        pagination: { current: 1, pageSize: 200 },
      });
      const names = list.data.map((item) => item.name);
      const randomName = names[Math.floor(Math.random() * names.length)];
      setAnswer(randomName);

      // 2) fetch the species flavor or name depending on mode
      if (mode === "entry") {
        const detail = await dataProvider.getOne<SpeciesDetail>({
          resource: "pokemon-species",
          id: randomName,
        });
        const english = detail.data.flavor_text_entries.filter(
          (e) => e.language.name === "en"
        );
        const raw =
          english[Math.floor(Math.random() * english.length)].flavor_text;
        setInitialText(sanitizeEntry(raw, randomName));
      } else {
        setInitialText(randomName);
      }

      // 3) fetch the full Pokémon details for sprite, types, and id
      const resp = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomName}`
      );
      if (resp.ok) {
        const json: PokemonDetail = await resp.json();
        setPokemonDetail(json);
      }
    } catch (err) {
      console.error("Error loading pokemon:", err);
    } finally {
      setLoadingData(false);
    }
  }, [dataProvider, mode]);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  const { translated, loading: translating, error } = useGoogleTranslate(
    initialText
  );

  const handleSubmit = () => {
    if (!guess.trim()) return;
    const correct = guess.trim().toLowerCase() === answer.toLowerCase();
    setFeedback(
      correct ? "🎉 Correct!" : `❌ Nope—it was ${answer.toUpperCase()}.`
    );
    onNext(correct);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (loadingData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={4} textAlign="center">
      <Typography variant="h6">Score: {score}</Typography>
      <Card sx={{ mb: 3, minHeight: 120 }}>
        <CardContent>
          {translating ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="body1">{translated}</Typography>
          )}
          {error && <Typography color="error">{error}</Typography>}
        </CardContent>
      </Card>

      <Box display="flex" gap={2} justifyContent="center" mb={2}>
        <TextField
          label="Your guess"
          value={guess}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGuess(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" onClick={loadPokemon}>
          Next
        </Button>
        <Button variant="outlined" onClick={onReset}>
          Change Mode
        </Button>
      </Box>

      {feedback && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {feedback}
          </Typography>

          {/* show the initial entry */}
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Initial entry: {initialText}
          </Typography>

          {/* Show Pokémon details only if the guess was correct */}
          {feedback.startsWith("🎉") && pokemonDetail && (
            <Card sx={{ mt: 2, p: 2, textAlign: "center" }}>
              <Box
                component="img"
                src={pokemonDetail.sprites.front_default || ""}
                alt={pokemonDetail.name}
                sx={{ width: 120, height: 120, mb: 1 }}
              />
              <Typography variant="h6" textTransform="capitalize">
                #{pokemonDetail.id} — {pokemonDetail.name}
              </Typography>
              <Box display="flex" justifyContent="center" gap={1} mt={1}>
                {pokemonDetail.types.map(({ type }) => (
                  <Chip
                    key={type.name}
                    label={type.name.toUpperCase()}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TranslateGame;
