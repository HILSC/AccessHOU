export default (theme) => ({

    mapContainer: {
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        height: '600px',
    },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    '& h1' : {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '30px',
    }
  },
  messages: {
    marginTop: theme.spacing(4),
  },
  options: {
    display:'flex',
    justifyContent: 'flex-end',
  },
  lastUpdated: {
    color: '#333',
    fontStyle: 'normal  ',
    fontSize: '18px',
    fontWeight: '400',
    margin: '10px 0 20px 0',
    background: '#f9f9f9',
    padding: '10px 30px',
    borderRadisu: '20px',
    display: 'inline-block',
  },
  button: {
    marginLeft: 5
  }
});
