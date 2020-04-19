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
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  actionContainer: {
    backgroundColor: '#bcdff1',
    borderRadius: 4,
    padding: 4
  },
  emergencyContainer: {
    backgroundColor: '#faf2cc',
    borderRadius: 4,
    padding: 4
  }
});
