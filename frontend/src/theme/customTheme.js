import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
    fontFamily: "\"Roboto Slab\", \"serif\", serif",
    fontSize: 14,
  },
  palette: {
    primary: {
      light: '#e8463a',
      main: '#e8463a',
      dark: '#e8463a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#28a745',
      main: '#28a745',
      dark: '#28a745',
      contrastText: '#fff',
    },
  },
});

export default theme;
