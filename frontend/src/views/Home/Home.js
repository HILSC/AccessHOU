import React, {
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import clsx from 'clsx';

import {
  BrowserView,
  MobileView,
  isMobile
} from "react-device-detect";

// Material UI components
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// Custom components
import ArrowTooltip from 'components/ArrowTooltip/ArrowTooltip';

import { PROGRAM_SERVICES } from 'constants.js';

import Food from 'images/food.svg';
import Family from 'images/family.svg';
import Health from 'images/health.svg';
import Housing from 'images/housing.svg';
import Education from 'images/education.svg';
import Legal from 'images/legal.svg';
import Employment from 'images/employment.svg';
import Money from 'images/money.svg';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './HomeStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  const [keyword, setkeyword] = useState();
  const [search, setSearch] = useState();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearch(true);
    }
  }

  const handleOnChange = (event) => {
    setkeyword(event.target.value);
  }

  const handleOnClickSearch = () => {
    setSearch(true);
  }

  const getServiceIcon = (service) => {
    switch(service) {
      case 'food':
        return Food;
      case 'family':
        return Family;
      case 'health':
        return Health;
      case 'housing':
        return Housing;
      case 'education':
        return Education;
      case 'legal':
        return Legal;
      case 'employment':
        return Employment;
      case 'money':
          return Money;
      default:
        return Legal;
    }
  }

  if(search) {
    const url = `/search/?keyword=${encodeURI(keyword)}`;
    return <Redirect push to={url} />
  }

  return (
    <React.Fragment>
      <div className={classes.heroContent}>
        <Container maxWidth="lg">
          <BrowserView>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              What kind of help do you need?
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Search through hundreds of agencies and programs that are ready to help you.
            </Typography>
          </BrowserView>
          <MobileView>
            <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
              What kind of help do you need?
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" paragraph>
              Search through hundreds of agencies and programs that are ready to help you.
            </Typography>
          </MobileView>
          <div className={isMobile ? classes.heroButtons : clsx(classes.heroButtons, classes.heroButtonsSize)}>
            <InputBase
              className={classes.input}
              placeholder="Search agencies, programs"
              inputProps={{
                'aria-label': 'search',
                'onKeyPress': handleKeyPress,
                'onChange': handleOnChange,
                'value': keyword ? keyword : '',
              }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <Button 
              variant="contained"
              color="primary"
              onClick={handleOnClickSearch}
            >Find Help</Button>
          </div>
        </Container>
      </div>
      {<Container className={isMobile ? classes.cardGridMobile : classes.cardGrid} maxWidth="lg">
        <Grid container spacing={4}>
          {PROGRAM_SERVICES.map(service => (
            <Grid item key={service.value} xs={6} sm={6} md={3}>
                <NavLink to={`/search/?service=${service.value}`} className={classes.customLink}>
                  <ArrowTooltip title={service.description}>
                    <Card className={classes.card}>
                      <CardContent>
                        {service.label}
                      </CardContent>
                      <CardContent>
                        <img alt={service.value} className={classes.serviceImg} src={getServiceIcon(service.value)}/>
                      </CardContent>
                    </Card>
                  </ArrowTooltip>
                </NavLink>
            </Grid>
          ))}
        </Grid>
      </Container>}
    </React.Fragment>
  );
}