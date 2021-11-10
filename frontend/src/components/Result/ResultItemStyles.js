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
  card: {
    minWidth: 275,
    marginBottom: theme.spacing(3),
    border: '1px solid #eee',
    borderRadius: '10px',
    '& p' :{
        fontSize: '16px',
        lineHeight: '24px',
    },
  },
  title:{
    color: '#696969',
    textWeight: '600',
    fontSize: '32px',
  },
  programTitle: {
    fontWeight: '400',
    color: 'grey',
    fontSize: '19px !important',
    padding: '0px 0 3px',
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
    fontSize: '22px !important',
    textDecoration: 'none',
    fontWeight: '500',
    color: '#e8463a',
    paddingBottom: '5px',
    padding: '3px 0 8px !important',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  customLink: {
    color: '#696969',
    textDecoration: 'none',
    '&:hover': {
      color: '#e8463a',
      textDecoration: 'underline',
    },
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
