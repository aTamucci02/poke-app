import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {
      default: grey[900],
      paper: grey[800],
    },
    text: {
      primary: '#fafafa',
      secondary: grey[500],
    },
  },
  typography: {
    fontFamily: ['PokemonDS', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* 1) register the face */
        @font-face {
          font-family: 'PokemonDS';
          src: url('/fonts/pokemon-ds-font.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        /* 2) set the html/body to use it by default */
        html, body {
          font-family: 'PokemonDS', system-ui, Avenir, Helvetica, Arial, sans-serif;
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});
