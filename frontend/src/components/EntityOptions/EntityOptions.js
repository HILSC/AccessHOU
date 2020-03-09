
import React from 'react';

// Material UI Components
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './EntityOptionsStyles';
const useStyles = makeStyles(styles);

const EntityOptions = ({ entity, handleChange }) => {
  const classes = useStyles();
  
  const handleOptionChange = (e) => {
    handleChange(e.target.value)
  }

  return (
    <RadioGroup row defaultValue={entity}>
      <FormControlLabel
        className={classes.entityOption}
        value="agency"
        control={<Radio color="primary" onChange={handleOptionChange} />}
        label="Agency"
        labelPlacement="end"
      />
      <FormControlLabel
        className={classes.entityOption}
        value="program"
        control={<Radio color="primary" onChange={handleOptionChange} />}
        label="Program"
        labelPlacement="end"
      />
    </RadioGroup>
  )
}

export default EntityOptions;
