import React from 'react';

import Typography from '@material-ui/core/Typography';

export default ({ text, variant, color, classes }) => {
  return (
    <Typography
      color={color ? color: 'inherit'}
      variant={variant ? variant : 'h6'}
      align="left"
      gutterBottom
      classes={classes}
    >
      {text}
    </Typography>
  )
}
