export default (theme) => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(3),
    minHeight: 700,
  },
  button: {
    margin: theme.spacing(1),
  },
  greenOutlinedButton: {
    borderColor: '#28a745',
    color: '#28a745',
    '&:hover': {
      backgroundColor: '#28a745',
      color: '#FFFFFF'
    }
  },
  centered: {
    textAlign: 'center',
  },
  search: {
    marginBottom: theme.spacing(10),
  },
  row: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#DCDCDC'
    }
  }
});
