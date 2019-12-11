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

export default ({ items, dataTextClass, options }) => {
  const classes = useStyles();

  const textClass = dataTextClass && dataTextClass === ACTION_CLASS.CHANGED ? classes.infoChanged :
    dataTextClass && dataTextClass === ACTION_CLASS.DELETED ? classes.infoDeleted : null;

  return (
    <div className={classes.root}>
      {items && Array.isArray(items) ? (
        
        items.map((item, idx) => {
          let item_found = options.filter(option => {
            if (typeof option === 'object' && option.value === item) {
              return option;
            }
            return null;
          });

          let label = item_found.length ? item_found[0].label : item;

          return <Chip
            key={idx}
            variant="default"
            size="small"
            label={label}
            className={clsx(classes.chip, textClass)}
          />
        })) :
      items }
    </div>
  )
}
