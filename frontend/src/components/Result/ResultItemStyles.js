export default (theme) => ({
  card: {
    minWidth: 275,
    marginBottom: theme.spacing(3),
  },
  title:{
    color: '#696969',
    textWeight: '600',
  },
  programTitle: {
    fontWeight: '400',
    color: 'grey',
    fontSize: '20px',
  },
  program: {
    borderTop: '1px solid #EDEDED',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#EDEDED'
    },
  },
  agency: {
    cursor: 'pointer',
    borderRadius: '4px',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#F9F9F9'
    },
  },
  agencyTitle:{
    color: '#000000',
    fontSize: '20px',
    textDecoration: 'none',
    fontWeight: '400',
  },
  customLink: {
    color: '#696969',
    textDecoration: 'none',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  icons: {
    marginRight: '8px'
  },
  phone: {
    marginTop: '8px'
  }
});
