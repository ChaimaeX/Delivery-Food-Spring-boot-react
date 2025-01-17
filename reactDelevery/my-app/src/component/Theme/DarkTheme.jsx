const { createTheme } = require("@mui/material");

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e91e63",
    },
    secondary: {
      main: "#5A20CB",
    },
    black: {
      main: "#000",
    },
    background: {
      default: "#000000", // Correction ici
      paper: "#0D0D0D",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
  },
});
