import React from 'react';
import clsx from 'clsx';

import Chip from '@material-ui/core/Chip';

import {
  ACTION_CLASS
} from 'constants.js';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './BadgeListStyles';
const useStyles = makeStyles(styles);

export default ({ items, dataTextClass }) => {
  const classes = useStyles();

  const textClass = dataTextClass && dataTextClass === ACTION_CLASS.CHANGED ? classes.infoChanged :
    dataTextClass && dataTextClass === ACTION_CLASS.DELETED ? classes.infoDeleted : null;

  return (
    <div className={classes.root}>
      {items ? (items.map((item, idx) => (
        <Chip
          key={idx}
          variant="default"
          size="small"
          label={item}
          className={clsx(classes.chip, textClass)}
        />
      ))) :
      null }
    </div>
  )
}
