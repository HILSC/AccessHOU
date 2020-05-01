export default (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
  },
  footer: {
    padding: theme.spacing(2),
    backgroundColor: '#F5F5F5',
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  emergencyMode: {
    fontSize: 18
  },
  emergencyModeIcon: {
    fontSize: 50
  }
});
