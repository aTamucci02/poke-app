import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
      background: {
      default: grey[900],
      paper: grey[800],
    },
    text: {
      primary: "#fafafa",
      secondary: grey[500],
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
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
  },
});
