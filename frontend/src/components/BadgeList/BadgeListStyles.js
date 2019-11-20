export default (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1),
  },
  infoDeleted: {
    color: 'red'
  },
  infoChanged: {
    color: 'green'
  }
});
