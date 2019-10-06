import React from 'react';

import Chip from '@material-ui/core/Chip';

import { makeStyles } from '@material-ui/core/styles';

import styles from './BadgeListStyles';

const useStyles = makeStyles(styles);

export default ({ items }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {items ? (items.map((item, idx) => (
        <Chip
          key={idx}
          variant="default"
          size="small"
          label={item}
          className={classes.chip}
        />
      ))) :
      null }
    </div>
  )
}
