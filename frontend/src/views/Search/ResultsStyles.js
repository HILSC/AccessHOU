export default (theme) => ({
  appBarContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    boxShadow: 'none',
    backgroundColor: '#FFF',
  },
  appBarContainerMobile: {
    paddingLeft: 10,
    paddingRight: 10,
    boxShadow: 'none',
    backgroundColor: '#FFF',
  },
  publicHeader: {
    width: '100%',
    display: 'flex',
    paddingLeft:24,
    paddingRight: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  toolbarContainer: {
    flexShrink: 0,
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
  },
  resultsContainer: {
    marginTop: theme.spacing(25),
    marginBottom: theme.spacing(3),
  },
  resultsContainerMobile: {
    marginTop: theme.spacing(42),
    marginBottom: theme.spacing(3),
  },
  resultsContainersOpenFilters: {
    marginTop: theme.spacing(38),
    marginBottom: theme.spacing(3),
  },
  resultsContainersOpenFiltersMobile: {
    marginTop: 385,
    marginBottom: theme.spacing(3),
  },
  loading: {
    textAlign: 'center',
    marginBottom: theme.spacing(70),
  },
  messages: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(70),
  },
  filters: {
    backgroundColor: '#F3F3F3',
    borderRadius: '4px',
    padding: '15px',
  },
  serviceTypeFilter: {
    maxWidth: 120,
  },
  immigrationFilter: {
    maxWidth: 120,
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
    minWidth: '100%',
    maxWidth: 150,
  },
  hilscButton: {
    minWidth: '120px',
  },
  filtersButton: {
    minWidth: '120px',
  },
  searchButton: {
    backgroundColor:  theme.palette.background.paper,
    boxShadow: 'none',
    border: '1px solid #ced4da',
    height: 41,
    '&:hover': {
      backgroundColor: '#F8F8F8',
      color: 'black',
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
      color: '#FFFFFF',
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
  filtersContainer: {
    marginTop: theme.spacing(1),
  },
  filtersContainerMobile: {
    marginTop: theme.spacing(1),
    padding: 0
  },
  resultsCountContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    color: '#696969',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0'
  },
  emergencyModeMessageContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 99,
  },
  toolTipText: {
    fontSize: '1rem !important'
  }
});
