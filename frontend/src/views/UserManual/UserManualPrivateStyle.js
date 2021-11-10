export default (theme) => ({
    bodyClass: {
        fontSize: '18px',
        lineHeight: '30px',
        '& p' : {
            marginBottom: '15px',
        },
        '& h2' : {
            marginTop: '30px',
        },
        '& ul': {
            padding: '0 25px 10px',
            fontSize: '18px',
            '& li' :{
                lineHeight: '28px'
            },
            '& ul' :{
                paddingLeft: '25px'
            }
        },
        '& ol': {
            fontSize: '18px',
            '& li' :{
                lineHeight: '28px'
            },
            '& ol' :{
                paddingLeft: '25px'
            }
        }
    },
    table: {
        textAlign: 'left',
        margin: '10px 0',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '10px',
        borderCollapse: 'collapse',
        '& tr' : {
            borderBottom: '1px solid #ddd',
            verticalAlign: 'top',
            '& td, th' : {
                padding: '10px',
            }
        },
    },
  title: {
    fontWeight: 100,
  },
  mainUL: {
    // listStyleType: 'none',
    fontSize: '18px',
    '& li' :{
        lineHeight: '28px'
    },
    '& ul' :{
        paddingLeft: '25px'
    }
  },
  circlesUL: {
    listStyleType: 'cicle',
    '& li' :{
        paddingLeft: '15px'
    }
  },
  primaryAnchor: {
    color: '#e8463a',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  }
});
