export default (theme) => ({
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(8),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    textAlign: 'right',
  },
});
