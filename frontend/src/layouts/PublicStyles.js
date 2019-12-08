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
    textAlign: 'center',
    flexDirection: 'column',
  },
  footerMobileP: {
    marginBottom: 16,
  },
  footerLink: {
    color:'#e8463a',
  },
  editorLink: {
    color:'#e8463a',
    fontSize: 18
  },
  heart:{
    textShadow: '0 0 0 red',
  },
  emergencyMode: {
    fontSize: 18
  },
  emergencyModeIcon: {
    fontSize: 50
  }
});
