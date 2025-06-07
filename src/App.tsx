// src/App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Refine, type DataProvider } from "@refinedev/core";
import { MuiInferencer } from "@refinedev/inferencer/mui";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { pokeApiDataProvider } from "./dataProvider/pokeApi";
import TranslationHomePage from "./pages/Translate/TranslationHomePage";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";

const App: React.FC = () => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);

  useEffect(() => {
    setDataProvider(pokeApiDataProvider);
  }, []);

  if (!dataProvider) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts a global reset + sensible defaults */}
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Refine dataProvider={dataProvider}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poketranslate" element={<TranslationHomePage />} />
            <Route element={<Outlet />}>
              <Route
                path="/pokemon"
                element={<MuiInferencer resource="pokemon" />}
              />
            </Route>
          </Routes>
        </Refine>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
