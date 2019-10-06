export default (theme) => ({
  heroContent: {
    backgroundColor: '#e9ecef',
    padding: theme.spacing(5, 0, 6),
  },
  heroButtons: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: '0 auto'
  },
  heroButtonsSize: {
    maxWidth: '50%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    margin: 2
  },
  divider: {
    height: 28,
    margin: 4,
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  cardGridMobile: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    fontWeight: 600,
    backgroundColor: '#F5F5F5',
    fontSize: 18,
    '&:hover': {
      backgroundColor: '#e8e8e8',
    }
  },
  serviceImg: {
    margin: '0 auto',
    width: '40%'
  },
  customLink: {
    color: 'inherit',
    textDecoration: 'none'
  },
});
