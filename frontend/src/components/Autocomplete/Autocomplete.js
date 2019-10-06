import React from 'react';
import Select from 'react-select';

// Material UI components
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AutocompleteStyles.js';
const useStyles = makeStyles(styles);

const inputComponent = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />;
}

const Menu = (props) => {
  return (
    <Paper square className={props.selectProps.classes.searchPaper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const Control = (props) => {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

const ValueContainer = (props) => {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

const NoOptionsMessage = (props) => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

const Option = (props) => {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

const SingleValue = (props) => {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

const Placeholder = (props) => {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

export default ({ suggestions, placeholder, handleSelect, handleChange }) => {
  const classes = useStyles();

  const handleChangeSingle = value => {
    handleSelect(value);
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: 'primary',
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
  };
  
  return (
    <Select
      classes={classes}
      styles={selectStyles}
      inputId="react-select-single"
      TextFieldProps={{
        InputLabelProps: {
          htmlFor: 'react-select-single',
          shrink: true,
        },
      }}
      onInputChange={handleChange}
      placeholder={placeholder}
      options={suggestions}
      components={components}
      onChange={handleChangeSingle}
    />
  );
}
