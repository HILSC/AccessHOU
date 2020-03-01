export default (theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  messages: {
    marginTop: theme.spacing(4),
  },
  options: {
    justifyContent: 'flex-end',
  },
  lastUpdated: {
    color: '#777879',
    fontStyle: 'italic',
    fontSize: '16px'
  },
  button: {
    marginLeft: 5
  }
});
