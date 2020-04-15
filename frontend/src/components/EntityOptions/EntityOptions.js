
import React from 'react';

// Material UI Components
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Custom Components
import ArrowTooltip from '../ArrowTooltip/ArrowTooltip';

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
      <ArrowTooltip title={'Search results for matching phrase in agency name. Will display all programs.'}>
        <FormControlLabel
          className={classes.entityOption}
          value="agency"
          control={<Radio color="primary" onChange={handleOptionChange} />}
          label="Agency"
          labelPlacement="end"
        />
      </ArrowTooltip>
      <ArrowTooltip title={'Search results for matching phrase in program name and/or description. Will display relevant programs.'}>
        <FormControlLabel
          className={classes.entityOption}
          value="program"
          control={<Radio color="primary" onChange={handleOptionChange} />}
          label="Program"
          labelPlacement="end"
        />
      </ArrowTooltip>
    </RadioGroup>
  )
}

export default EntityOptions;
