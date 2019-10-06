import React from 'react';

// Custom components
import Label from 'components/Label/Label';

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./ProgramItemsStyles";
const useStyles = makeStyles(styles);

const ProgramItem = ({ program, handleSelect }) => {
  const classes = useStyles();

  const handleRowSelected = () => {
    handleSelect(program);
  }

  return (
    <div className={classes.cell} onClick={handleRowSelected}>
      <Label text={program.name} variant="h5" />
      <Label text={program.description} variant="body1" />
      <p><b>Phone: </b><a href={`tel:${program.phone}`}>{program.phone}</a></p>
    </div>
  )
}

export default ({ programs, handleSelect }) => {
  //const classes = useStyles();

  const handleSelectedRow = (program) => {
    handleSelect(program)
  }
  
  return (
    <React.Fragment>
      {programs.map(program => (
        <ProgramItem key={program.id} program={program} handleSelect={handleSelectedRow} />
      ))}
    </React.Fragment>
  )
}
