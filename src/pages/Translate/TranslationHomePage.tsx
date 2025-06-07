import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TranslateGame from "./TranslateGame";

const TranslationHomePage: React.FC = () => {
  const [mode, setMode] = useState<'entry' | 'name' | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleMode = (newMode: 'entry' | 'name') => {
    setMode(newMode);
  };

  const handleNext = (correct: boolean) => {
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleReset = () => {
    setMode(null);
    setScore(0);
  };

  if (!mode) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Translation Challenge
        </Typography>
        <Typography variant="h6" gutterBottom>
          Score: {score}
        </Typography>
        <Box display="flex" gap={2} justifyContent="center">
          <Button variant="contained" onClick={() => handleMode('entry')}>
            Guess Pokédex Entry
          </Button>
          <Button variant="contained" onClick={() => handleMode('name')}>
            Guess Pokémon Name
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <TranslateGame
      mode={mode}
      onNext={handleNext}
      onReset={handleReset}
      score={score}
    />
  );
};

export default TranslationHomePage;
