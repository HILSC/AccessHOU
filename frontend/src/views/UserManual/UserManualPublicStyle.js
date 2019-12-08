export default (theme) => ({
  title: {
    fontWeight: 100
  },
  mainUL: {
    listStyleType: 'none',
  },
  circlesUL: {
    listStyleType: 'cicle',
  },
  primaryAnchor: {
    color: '#e8463a',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  }
});
