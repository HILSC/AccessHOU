export default (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    backgroundColor: '#F5F5F5',
  },
  footerP: {
    margin: 0,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  customLink: {
    color: 'inherit',
    textDecoration: 'none'
  },
  signInButton: {
    minWidth: 80,
    marginRight: 5
  },
  mobileFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  footerMobileP: {
    textAlign: 'center'
  },
});
