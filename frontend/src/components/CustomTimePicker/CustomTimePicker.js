import React from "react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';

export default ({ name, values, defaultValue, day, handleTimePicked }) => {
  const handleChange = (value) => {
    if (value) {
      handleTimePicked({name: name, value: value.format('h:mm A')});
    } else{
      handleTimePicked({name: name, value: ''});
    }
  }

  const format = 'h:mm A';

  let value = defaultValue;

  if (values[name]) {
    value = moment(values[name], format);
  } else if (values[name] === '' || !values[name]) {
    value = null;
  }

  const weekends = ["Sunday", "Saturday"];

  if (value === defaultValue && weekends.includes(day)){
    value = null;
  }

  return (
    <TimePicker
      showSecond={false}
      defaultValue={value}
      onChange={handleChange}
      format={format}
      minuteStep={15}
      use12Hours
      inputReadOnly
    />
  )
}
