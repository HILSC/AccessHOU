import { createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/styles";
import MuiButton from "@material-ui/core/Button";

export const CustomBlueButton = withStyles(theme => ({
  root: props =>
    props.color === "info" && props.variant === "contained"
      ? {
          color: theme.palette.info.contrastText,
          backgroundColor: theme.palette.info.main,
          "&:hover": {
            backgroundColor: theme.palette.info.dark,
            "@media (hover: none)": {
              backgroundColor: theme.palette.info.main
            }
          }
        }
      : {}
}))(MuiButton);

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
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fff'
    }
  },
});

theme.palette.success = theme.palette.augmentColor({
  main: "#689f38"
});

export default theme;
