export default (theme) => ({
    default: {
        fontSize: '15px',
        margin: '0 0 5px 0',
        fontWeight: '400',
        lineHeight: '21px',
    },
    link: {
        fontSize: '15px',
        margin: '0 0 5px 0',
        color: '#e8463a',
    },
    default2: {
        fontSize: '15px',
        margin: '0 0 15px 0',
        fontWeight: '400',
        lineHeight: '21px',
    },
    title: {
        fontSize: '18px',
        textDecoration: 'none',
        margin: '0 0 5px 0',
        fontWeight: '700'
    },
    titleLink: {
        textDecoration: 'none',
        color: '#111',
        '&:hover': {
          color: '#e8463a'
          },
        '&:focus-visible': {
          outline: 'none'
        }
    },
    break: {
        height: '0px',
        background: '#eee',
        boxShadow: 'none',
        borderTop: '0',
        margin: '15px 0',
    },
    verified: {
        padding: '5px 10px',
        fontSize: '10px',
        textTransform: 'uppercase',
        borderRadius: '5px',
        fontWeight: '400',
        letterSpacing: '.5px',
        position: 'relative',
        top: '-1px',
        background: '#e8463a',
        color: '#fff',
        display:'inline-block',
        marginBottom: '0',
        marginLeft: '20px',
        float:'right',
    },
    language: {
        display: 'inline-block',
        background: '#eee',
        borderRadius: '5px',
        padding: '5px 15px',
        margin: '5px 5px 0 0',
        fontSize: '14px',

    }
});
