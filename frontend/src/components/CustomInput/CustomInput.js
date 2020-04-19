import React from "react";
import PropTypes from "prop-types";
import MaskedInput from 'react-text-mask';

import {
  isMobile,
} from "react-device-detect";

// Material UI Components
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// Custom Components
import ArrowTooltip from 'components/ArrowTooltip/ArrowTooltip';

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./CustomInputStyles";
const useStyles = makeStyles(styles);

// Masked input
const PhoneInput = (props) => {
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
  labelProps,
  inputProps,
  options,
  errorDetails,
  isRequired,
  showNA=true,
  autoFocus=false,
  labelInfo={ show: false }
}) => {
  const classes = useStyles();

  const renderInputLabel = () => {
    return (
      <Typography htmlFor={`${id}-input`} {...labelProps} classes={{
        root: classes.customLabel
      }}>
        {labelText}{' '}{isRequired ? (<span className={classes.required}> * </span>) : null}
        {
          labelInfo.show ? (
            <span className={classes.customlabelSVG}>
              <ArrowTooltip title={labelInfo.msg}>
                <InfoOutlinedIcon color="primary" fontSize="medium" />
              </ArrowTooltip>
            </span>
          ) : null
        }
      </Typography>
    )
  }

  return (
    <FormControl
      {...formControlProps}
    >
      {
        type === "select" ? (
          <React.Fragment>
            {renderInputLabel()}
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
            {renderInputLabel()}
            <Select
              multiple
              id={`${id}-input`}
              classes={{
                root: isMobile && labelText.length > 35 ? classes.controlLabelSpace : ''
              }}
              {...inputProps}
              input={<Input id={`${id}-input`} />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => {
                    let item_found = options.filter(item => {
                      if (typeof item === 'object' && item.value === value) {
                        return item
                      }

                      return null;
                    });
                    let label = item_found.length ? item_found[0].label : value;
                    return (<Chip key={value} label={label} className={classes.chip} />)
                  })
                  }
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
            {renderInputLabel()}
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
  labelInfo: PropTypes.object,
};

export default CustomInput;
