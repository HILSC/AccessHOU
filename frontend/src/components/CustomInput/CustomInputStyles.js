export default (theme) => ({
  chips: {
    display: "flex", 
    flexWrap: "wrap",
  },
  chip: {
    margin: theme.spacing(1),
  },
  required: {
    marginLeft: 5,
    color: '#e8463a'
  },
  controlLabelSpace: {
    marginTop: '30px',
  },
  customLabel: {
    display: 'flex',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  customlabelSVG: {
    marginLeft: 5
  }
});
