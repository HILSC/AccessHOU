import React from 'react';
import clsx from 'clsx';
import { NavLink } from "react-router-dom";

import {
  MobileView,
  BrowserView,
} from "react-device-detect";

// Material UI components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';

import { formatURL } from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ResultItemStyles';
const useStyles = makeStyles(styles);

const ProgramItem = ({ classes, program, handleProgramSelect }) => {

  const handleSelect = () => {
    handleProgramSelect(program);
  }

  return (
    <div className={classes.program} onClick={handleSelect}>
      <BrowserView>
        <Typography className={classes.programTitle}>
          {program.name}
        </Typography>
      </BrowserView>
      <MobileView>
        <Typography variant="h6">
          {program.name}
        </Typography>
      </MobileView>
      <Typography variant="body2" component="p">
        {program.description}
      </Typography>
      {
        program.phone && program.phone.length ? (
          <div className={clsx(classes.info, classes.phone)}>
            <PhoneIcon fontSize="small" color="primary" classes={{
              root: classes.icons
            }} />
            <Typography variant="body2" component="p">
              <a className={classes.customLink} target="_blank" rel="noopener noreferrer" href={`tel:${program.phone}`}>{program.phone}</a>
            </Typography>
          </div>
        ) : null
      }
    </div>
  )
}

const AgencyItem = ({ classes, agency, programs, handleProgramSelect }) => {
  return (
    <React.Fragment>
      <Typography>
        <NavLink to={`/agency/${agency.slug}`} className={classes.agencyCustomLink}>
          {agency.name}
        </NavLink>
      </Typography>
      {
        (agency.street && agency.city && agency.state && agency.zipcode) || agency.street ? (
          <div className={classes.info}>
            <LocationOnIcon fontSize="small" color="primary" classes={{
              root: classes.icons
            }} />
            <Typography className={classes.title} color="textSecondary" gutterBottom>
            {agency.street && agency.city && agency.state && agency.zipcode ?
                (<a className={classes.customLink} target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=${agency.street}. ${agency.city}, ${agency.state} ${agency.zipcode}`}>{`${agency.street} ${agency.city}, ${agency.state} ${agency.zipcode}`}</a>) :
                (<a className={classes.customLink} target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=${agency.street}`}>{agency.street}</a>)}
            </Typography>
          </div>
        ) : null
      }
      {
        agency.website && agency.website.length ? (
          <div className={classes.info}>
            <LinkIcon fontSize="small" color="primary" classes={{
              root: classes.icons
            }} />
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              { agency.website !== '' ? (
                <a className={classes.customLink} target="_blank" rel="noopener noreferrer" href={formatURL(agency.website)}>{agency.website}</a>
              ) : null }
            </Typography>
          </div>
        ) : null
      }
      {programs.map((program, programIdx) => (
        <ProgramItem key={programIdx} classes={classes} program={program} handleProgramSelect={handleProgramSelect} />
      ))}
    </React.Fragment>
  )
}

export default ({ data, handleOnClickProgram}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {data.map((d, dIdx)=> (
        <Card className={classes.card} key={dIdx}>
          <CardContent>
            <AgencyItem classes={classes} agency={d.agency} programs={d.programs} handleProgramSelect={handleOnClickProgram} />
          </CardContent>
        </Card>
      ))}
    </React.Fragment>
    
  )
}
