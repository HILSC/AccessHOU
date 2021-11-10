export default (theme) => ({
    heroList: {
        maxWidth: '800px',
        margin: 'auto',
        textAlign: 'left',
    },
    heroStrong: {
        fontSize: '30px',
        paddingBottom: '30px',
        display: 'inline-block',
        paddingTop:'20px'
    },
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
  heroTextSecondary: {
      fontSize: '22px',
      color: '#333',
      lineHeight: '36px',
      margin: 'auto',
      marginBottom: '30px',
      maxWidth: '1024px',
      textAlign:'center',
  },
  heroTextPrimary: {
      fontSize: '50px',
      color: '#111',
      lineHeight: '60px',
      marginBottom: '30px',
      fontWeight: '600'
  },
  entityOptions: {
    maxWidth: '50%',
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
    paddingTop: theme.spacing(2),
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
  stormMessage: {
    padding: '4px',
    border: 'solid 1px #e8463a',
    background: '#e8463a',
    color: '#fff',
    borderRadius: 4,
    fontSize: '18px',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    fontWeight: '400',
    padding:'20px',
    textAlign:'left',
    overflow:'hidden',
    margin: '0 0 30px 0',
    },
    stormIcon: {
        maxWidth: '50px',
        float: 'left',
        paddingLeft:'15px',
        transform: 'rotate(180deg)',
    },
  stormMessageText : {
    color: '#fff',
    textDecoration: 'none',
    float: 'left',
    maxWidth:'70%',
    margin:'0',
},
stormMessageLink : {
  color: '#f3bbb5',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  }
},
stormMessageButton : {
  color: '#fff',
  textDecoration: 'none',
  float: 'right',
  background: '#a2392c',
  padding: '15px 40px',
  textAlgin: 'center',
  borderRadius: '10px',
  maxWidth:'20%',
}
});
