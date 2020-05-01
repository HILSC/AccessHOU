import React from 'react';
import PropTypes from "prop-types";

// Material UI components
import Tooltip from '@material-ui/core/Tooltip';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ArrowTooltipStyles';
const useStyles = makeStyles(styles);

const ArrowTooltip = (props) => {
  const { arrow, title, ...classes } = useStyles();
  const [arrowRef, setArrowRef] = React.useState(null);

  return (
    <Tooltip
      classes={classes}
      PopperProps={{
        popperOptions: {
          modifiers: {
            arrow: {
              enabled: Boolean(arrowRef),
              element: arrowRef,
            },
          },
        },
      }}
      {...props}
      title={
        <React.Fragment>
          <span className={title}>{props.title}</span>
          <span className={arrow} ref={setArrowRef} />
        </React.Fragment>
      }
    />
  );
}

ArrowTooltip.propTypes = {
  title: PropTypes.string,
};

export default ArrowTooltip;
