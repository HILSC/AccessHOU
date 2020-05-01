export default (theme) => ({
  title: {
    fontWeight: 100
  },
  table: {
    minWidth: 650,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  dialogContent: {
    overflowY: 'auto',
    maxHeight: 600
  },
  messages: {
    marginTop: theme.spacing(4),
  },
  formControl: {
    minWidth: '100%'
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    height: 41,
    border: '1px solid #CECECE'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 5,
  }
});
