export default (theme) => ({
  success: {
    backgroundColor: '#dff0d8',
    color: '#3c763d',
  },
  error: {
    backgroundColor: '#ebcccc',
    color: '#a94442'
  },
  info: {
    backgroundColor: '#bcdff1',
    color: '#31708f'
  },
  warning: {
    backgroundColor: '#faf2cc',
    color: '#8a6d3b'
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  // alertBox: {
  //   marginBottom: theme.spacing(3),
  // }
});
