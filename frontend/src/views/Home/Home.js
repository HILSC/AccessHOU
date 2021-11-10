import React, {
  useState,
  useEffect
} from 'react';
import { Redirect, NavLink } from 'react-router-dom';
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
import EntityOptions from 'components/EntityOptions/EntityOptions';

import { PROGRAM_SERVICES } from 'constants.js';

import Food from 'images/food.svg';
import Family from 'images/family.svg';
import Health from 'images/health.svg';
import Housing from 'images/housing.svg';
import Education from 'images/education.svg';
import Legal from 'images/legal.svg';
import Employment from 'images/employment.svg';
import Money from 'images/money.svg';
import InfoIcon from "../../images/info-bubble.png";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './HomeStyles';
const useStyles = makeStyles(styles);

const cleanLocalStorage = () => {
  const filters = [
    'search',
    'entity',
    'serviceType',
    'HILSCVerified',
    'immigrationStatus',
    'zipCode',
    'radius',
    'incomeEligibility',
    'immigrantAccProfile',
    'walkInHours',
    'programLanguages',
    'adaAccessible',
    'showMorefilters',
    'cleared'
  ];
  filters.forEach(item => localStorage.removeItem(item));
}

export default () => {
  const classes = useStyles();
  const [entity, setEntity] = useState('agency')
  const [keyword, setkeyword] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    cleanLocalStorage();
  });

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

  const handleEntityChange = (entity) => {
    setEntity(entity);
  }

  if(search) {
    localStorage.setItem('search', encodeURI(keyword));
    localStorage.setItem('entity', entity);
    const url = `/search/?keyword=${encodeURI(keyword)}&entity=${entity}`;
    return <Redirect push to={url} />
  }

  return (
    <React.Fragment>
      <div className={classes.heroContent}>
        <Container maxWidth="lg">
        <BrowserView>
        <div className={classes.stormMessage}>
          <img className={classes.stormIcon} alt="Disaster Resource Guide Information" src={InfoIcon} />
          <p className={classes.stormMessageText}>AccessHOU is a directory of information for on-going social services.
          For real-time emergency information and resources use the <a className={classes.stormMessageLink} href="http://bit.ly/37GE4n4" target="_blank" rel="noopener noreferrer">Immigrant Disaster Resource Guide.</a></p>
          <a className={classes.stormMessageButton} href="http://bit.ly/37GE4n4" target="_blank" rel="noopener noreferrer">View The Guide</a>
        </div>
        </BrowserView>
        <MobileView>
        <div className={classes.stormMessage}>
          <p className={classes.stormMessageText} style={{maxWidth:'100%',marginBottom:'20px'}}>AccessHOU is a directory of information for on-going social services.
          For real-time emergency information and resources use the <a className={classes.stormMessageLink} href="http://bit.ly/37GE4n4" target="_blank" rel="noopener noreferrer">Immigrant Disaster Resource Guide.</a></p>
          <a className={classes.stormMessageButton} style={{maxWidth:'100%',display:'block',boxSizing:'border-box',clear:'both',float:'none',textAlign:'center'}} href="http://bit.ly/37GE4n4" target="_blank" rel="noopener noreferrer">View The Guide</a>
        </div>
        </MobileView>
          <BrowserView>
            <div className={classes.heroTextSecondary} style={{textAlgin:'center'}}>
              <strong className={classes.heroStrong}>This website was created by and for immigrant advocates. It will:</strong>
                <ol className={classes.heroList}>
                    <li>Help you find appropriate programs for your immigrant clients</li>
                    <li>Provide you a place to share the work of keeping resources up to date.</li>
                </ol>
                <p>By everyone editing services -- for their own and other agencies -- the burden to keep a referal list current doesn't fall on one agency. Don't worry -- you can't mess it up! All edits are vetted before going live. Please help keep this resource relevant by adding updates today!</p>
            </div>
            <div className={classes.entityOptions}>
              <EntityOptions handleChange={handleEntityChange} entity={entity} />
            </div>
          </BrowserView>
          <MobileView>
              <div className={classes.heroTextSecondary} style={{textAlgin:'center'}}>
                <strong className={classes.heroStrong}>This website was created by and for immigrant advocates. It will:</strong>
                  <ol className={classes.heroList}>
                      <li>Help you find appropriate programs for your immigrant clients</li>
                      <li>Provide you a place to share the work of keeping resources up to date.</li>
                  </ol>
                  <p>By everyone editing services -- for their own and other agencies -- the burden to keep a referal list current doesn't fall on one agency. Don't worry -- you can't mess it up! All edits are vetted before going live. Please help keep this resource relevant by adding updates today!</p>
              </div>
            <div>
              <EntityOptions handleChange={handleEntityChange} entity={entity} />
            </div>
          </MobileView>
          <div className={isMobile ? classes.heroButtons : clsx(classes.heroButtons, classes.heroButtonsSize)}>
            <InputBase
              className={classes.input}
              placeholder={ entity == 'agency' ? `Search ${entity} by title` : `Search ${entity} by title and description`}
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
          <p style={{ fontSize:'15px', margin: '10px auto', maxWidth: '612px' }}><a style={{color:'#666',textDecoration:'underline'}} href="/agencies/map">Click here to view a map of our HILSC Network Partners</a></p>
        </Container>
      </div>
      {<Container className={isMobile ? classes.cardGridMobile : classes.cardGrid} maxWidth="lg">
        <Grid container spacing={4}>
          {PROGRAM_SERVICES.map(service => (
            <Grid item key={service.value} xs={6} sm={6} md={3}>
                <NavLink to={`/search/?service=${service.value}&entity=program`} className={classes.customLink}>
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
