export default (theme) => ({
  resultsContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  loading: {
    textAlign: 'center'
  },
  messages: {
    marginTop: theme.spacing(4),
  },
  filters: {
    backgroundColor: '#F3F3F3',
    borderRadius: '4px',
    padding: '15px'
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    height: 41
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  formControl: {
    minWidth: '100%'
  },
  hilscButton: {
    minWidth: '130px',
  },
  serviceTypeSelect: {
    maxWidth: '150px',
  },
  searchButton: {
    backgroundColor:  theme.palette.background.paper,
    boxShadow: 'none',
    border: '1px solid #ced4da',
    height: 41,
    '&:hover': {
      backgroundColor: '#F8F8F8',
      color: 'black'
    }
  },
  searchButtonActive: {
    backgroundColor: '#e8463a',
    color: '#FFFFFF',
    boxShadow: 'none',
    border: '1px solid #ced4da',
    height: 41,
    '&:hover': {
      backgroundColor: '#e53123',
      color: '#FFFFFF'
    }
  },
  selectIcon: {
    color: '#e8463a'
  },
  iconInButton: {
    marginRight: theme.spacing(1),
    color: '#e8463a'
  },
  iconInButtonActive: {
    marginRight: theme.spacing(1),
    color: '#FFFFFF'
  },
  adaButton: {
    minWidth: '150px'
  },
  walkInButton: {
    minWidth: '200px'
  },
  zipCode: {
    minWidth: '150px'
  },
  tableContainer:{
    minWidth: '100%',
    overflowX: 'scroll'
  },
  tableCellContainer: {
    padding: '5px',
    borderBottom: 0
  },
});
