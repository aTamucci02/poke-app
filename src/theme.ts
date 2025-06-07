// src/theme.ts
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    // you can override default props/styles globally here
    MuiButton: {
      defaultProps: {
        size: "medium",
      },
    },
  },
});
