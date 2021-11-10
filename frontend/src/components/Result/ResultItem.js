import React from 'react';
import clsx from 'clsx';

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
import VerifiedIcon from "../../images/hilsc-verified-icon.png";

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
         {/* <span className={ agency.hilsc_verified ? classes.verifiedTrue : classes.verifiedFalse}>
            HILSC Network Partner</span> */}
        <Typography className={classes.programTitle}>
          {program.name}
        </Typography>
      </BrowserView>
      <MobileView>
      {/* <span className={ agency.hilsc_verified ? classes.verifiedTrue : classes.verifiedFalse}>
        HILSC Network Partner</span> */}
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

const AgencyItem = ({ classes, agency, programs, handleAgencySelect, handleProgramSelect }) => {

  const handleSelect = (e) => {
    handleAgencySelect(agency);
  }

  const handleClickLocation = (e) => {
    e.stopPropagation();
  }

  return (
    <React.Fragment>
      <div className={classes.agency} onClick={handleSelect}>
          <span className={ agency.hilsc_verified ? classes.verifiedTrue : classes.verifiedFalse}>
            HILSC Network Partner</span>
        <Typography className={classes.agencyTitle}>
         {agency.name}
        </Typography>
        {
          (agency.street && agency.city && agency.state && agency.zipcode) || agency.street ? (
            <div className={classes.info}>
              <LocationOnIcon fontSize="small" color="primary" classes={{
                root: classes.icons
              }} />
              <Typography className={classes.title} color="textSecondary" gutterBottom>
              {agency.street && agency.city && agency.state && agency.zipcode ?
                  (<a className={classes.customLink} onClick={handleClickLocation} target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=${agency.street}. ${agency.city}, ${agency.state} ${agency.zipcode}`}>{`${agency.street}, ${agency.city}, ${agency.state} ${agency.zipcode}`}</a>) :
                  (<a className={classes.customLink} onClick={handleClickLocation} target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=${agency.street}`}>{agency.street}</a>)}
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
      </div>
      {programs.map((program, programIdx) => (
        <ProgramItem key={programIdx} classes={classes} program={program} handleProgramSelect={handleProgramSelect} />
      ))}
    </React.Fragment>
  )
}

export default ({ data, handleOnClickAgency, handleOnClickProgram}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {data.map((d, dIdx)=> (
        <Card className={classes.card} key={dIdx}>
          <CardContent>
            <AgencyItem
              classes={classes}
              agency={d.agency}
              programs={d.programs}
              handleAgencySelect={handleOnClickAgency}
              handleProgramSelect={handleOnClickProgram} />
          </CardContent>
        </Card>
      ))}
    </React.Fragment>

  )
}
