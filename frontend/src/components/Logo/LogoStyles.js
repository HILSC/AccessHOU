export default (theme) => ({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  imageLogo: {
    marginTop: 10,
    marginBottom: 10,
    height: 75,
    with: 75,
  },
  logoTextContainer: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 8,
    borderLeft: '2px dotted #e8463a',
    // display: 'flex',
    verticalAlign: 'middle',
  },
  logoText: {
    margin: 'auto',
    paddingLeft: 10,
    fontSize: '1.75rem',
    fontWeight: '400',
    color: '#000',
    fontSize: '20px',
    // maxWidth: '400px',
    marginLeft: '15px',
    marginTop: '12px',
    display: 'block'
  }
});
