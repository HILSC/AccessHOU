import React from "react";
import PropTypes from "prop-types";
import MaskedInput from 'react-text-mask';

import {
  isMobile,
} from "react-device-detect";

// Material UI Components
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./CustomInputStyles";
const useStyles = makeStyles(styles);

// Masked input
function PhoneInput(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'_'}
      showMask={true}
      guide={true}
      keepCharPositions={false}
    />
  );
}

const CustomInput = ({
  type, 
  formControlProps,
  labelText,
  id,
  htmlFor,
  labelProps,
  inputProps,
  options,
  errorDetails,
  isRequired,
  showNA=true,
  autoFocus=false
}) => {
  const classes = useStyles();

  return (
    <FormControl
      {...formControlProps}
    >
      {
        type === "select" ? (
          <React.Fragment>
            <InputLabel {...labelProps}>{labelText}{isRequired ? (<span className={classes.required}> *</span>) : null}</InputLabel>
            <Select
                id={id}
                classes={{
                  root: isMobile && labelText.length > 35 ? classes.controlLabelSpace : ''
                }}
                {...inputProps}
              >
              {
                showNA ? (
                  <MenuItem value="n/a">N/A</MenuItem>
                ) : null
              }
              {options.map((option, idx) => <MenuItem key={idx} value={option.value ? option.value : option.toLowerCase()}>{option.label ? option.label : option}</MenuItem>)}
            </Select>
          </React.Fragment>
        ) : type === "multiselect" ? (
          <React.Fragment>
            <InputLabel htmlFor={`${id}-input`}>{labelText}{isRequired ? (<span className={classes.required}> *</span>) : null}</InputLabel>
            <Select
              multiple
              id={id}
              classes={{
                root: isMobile && labelText.length > 35 ? classes.controlLabelSpace : ''
              }}
              {...inputProps}
              input={<Input id={`${id}-input`} />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
            >
              {options.map((option, idx) => (
                <MenuItem key={idx} value={option.value ? option.value : option}>
                  <Checkbox checked={inputProps.value.indexOf(option.value ? option.value : option) > -1} />
                  <ListItemText primary={option.label ? option.label : option} />
                </MenuItem>
              ))}
            </Select>
          </React.Fragment>
        ) : type === "phone" ? (
          <React.Fragment>
            <InputLabel htmlFor={htmlFor}>{labelText}{isRequired ? (<span className={classes.required}> *</span>) : null}</InputLabel>
            <Input
              classes={{
                root: isMobile && labelText.length > 35 ? classes.controlLabelSpace : ''
              }}
              {...inputProps}
              inputComponent={PhoneInput}
            />
          </React.Fragment>
        ) : ( <TextField
            id={id}
            autoFocus={autoFocus}
            {...inputProps}
          />
        )
      }
      {
        errorDetails && errorDetails.error ? (
          <FormHelperText>{errorDetails.message}</FormHelperText>
        ) : null
      }
    </FormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  type: PropTypes.string,
  options: PropTypes.array,
  selectedOptions: PropTypes.array,
  errorDetails: PropTypes.object,
  showNA: PropTypes.bool,
};

export default CustomInput;
