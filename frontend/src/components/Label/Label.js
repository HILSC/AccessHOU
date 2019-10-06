import React from 'react';

import Typography from '@material-ui/core/Typography';

export default ({ text, variant, color }) => {
  return (
    <Typography color={color ? color: 'inherit'} variant={variant ? variant : 'h6'} align="left" gutterBottom>
      {text}
    </Typography>
  )
}
