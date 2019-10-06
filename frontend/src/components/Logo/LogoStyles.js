export default (theme) => ({
  logo: {
    fontSize: '1.25rem',
    '&::before': {
      content: `'NeedHOU'`,
      color: '#e8463a',
      borderRight: '2px dotted #e8463a',
      paddingRight: '8px',
      marginRight: '8px',
      fontWeight: '400',
    },
  }
});
