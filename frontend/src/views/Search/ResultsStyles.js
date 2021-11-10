export default (theme) => ({
    messagesHelp: {
        textAlign: 'left',
        fontSize: '18px',
        maxWidth: '620px',
        margin: '20px auto 0',
        paddingTop: '10px',
        opacity: '.7',
    },
    hilscFalse: {
        display: 'none',
    },
    helpText: {
        // color: '#444',
        fontSize: '18px',
        color: '#888',
        fontSize: '16px',
        padding: '0 5px',
        maxWidth: '980px',
        margin: '10px 0 0',
    },
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
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.05), 0px 1px 10px 0px rgba(0,0,0,0.05)',
  },
  toolbarContainer: {
    flexShrink: 0,
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
  },
  resultsNumber: {
      margin: '10px 5px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '16px',
  },
  resultsContainer: {
    marginTop: theme.spacing(28.5),
    marginBottom: theme.spacing(3),
  },
  resultsContainerMobile: {
    marginTop: theme.spacing(45),
    marginBottom: theme.spacing(3),
  },
  resultsContainersOpenFilters: {
    marginTop: theme.spacing(43.5),
    marginBottom: theme.spacing(3),
  },
  resultsContainersOpenFiltersMobile: {
    marginTop: theme.spacing(77.5),
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
    borderRadius: '0 0 5px 5px',
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
    '& span' : {
        lineHeight: '15px',
    },
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
