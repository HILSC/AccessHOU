export default (theme) => ({
    verifiedFalse: {
        display: 'none'
    },
    verifiedTrue: {
        padding: '5px 10px',
        background: '#e8463a',
        color: '#fff',
        fontSize: '10px',
        textTransform: 'uppercase',
        borderRadius: '5px',
        fontWeight: '400',
        // marginLeft: '10px',
        background: '#eee',
        color: '#777',
        letterSpacing: '.5px',
        position: 'relative',
        top: '-1px',
        background: '#e8463a',
        color: '#fff',
        display:'inline-block',
        marginBottom: '5px',
    },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  customLink: {
    fontSize: '16px',
  },
  infoDeleted: {
    color: 'red'
  },
  infoChanged: {
    color: 'green'
  },
  agencyCustomLink: {
    textDecoration: 'none',
    color: 'black'
  },
});
