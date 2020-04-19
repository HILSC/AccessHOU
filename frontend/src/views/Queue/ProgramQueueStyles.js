export default (theme) => ({
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  messages: {
    marginTop: theme.spacing(4),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    minWidth: 120
  },
  actionContainer: {
    backgroundColor: '#bcdff1',
    borderRadius: 4,
    padding: 4
  },
  emergencyContainer: {
    backgroundColor: '#faf2cc',
    borderRadius: 4,
    padding: 4
  }
});
