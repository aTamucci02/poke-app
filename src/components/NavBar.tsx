import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PokeApp
        </Typography>

        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ textTransform: "none" }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/pokemon"
            sx={{ textTransform: "none" }}
          >
            Pokémon List
          </Button>
          <Button
           color="inherit"
           component={RouterLink}
           to="/poketranslate"
           sx={{ textTransform: "none" }}
           >
           Translate
         </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
