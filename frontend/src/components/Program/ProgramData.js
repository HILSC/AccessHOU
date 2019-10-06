import React from 'react';
import { NavLink } from "react-router-dom";

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Label from 'components/Label/Label';
import DataLabel from 'components/DataLabel/DataLabel';
import ScheduleData from 'components/Schedule/ScheduleData';

import { 
  formatURL,
  hasSchedule 
} from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramDataStyles';
const useStyles = makeStyles(styles);

export default ({ program, showMissingData }) => {
  const classes = useStyles();
  if (program) {
    return (
      <Container>
        <CssBaseline />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography className={classes.programTitle}>
              {program.name}
            </Typography>
            <NavLink to={`/agency/${program.agency_slug}`} className={classes.agencyCustomLink}>
              {`A program from: ${program.agency_name}`}
            </NavLink>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Label text="General Info" variant="h5" color="primary" />
          </Grid>
          {
            // Description
            showMissingData || (program && program.description) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Description'}
                  dataText={program ? program.description : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Service Types
            showMissingData || (program && program.service_types) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Service Types'}
                  dataText={program ? program.service_types : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Is case management Provided?
            showMissingData || (program && program.case_management_provided) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Is case management Provided?'}
                  dataText={program.case_management_provided}
                />
              </Grid>
            ) : null
          }
          {
            // Case management notes
            showMissingData || (program && program.case_management_notes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Case management notes'}
                  dataText={program ? program.case_management_notes : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Website
            showMissingData || (program && program.website) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Website'}
                  dataText={program ? formatURL(program.website) : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Phone
            showMissingData || (program && program.phone) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Phone'}
                  dataText={program ? program.phone : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Street
            showMissingData || (program && program.street) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Street'}
                  dataText={program ? program.street : ''}
                />
              </Grid>
            ) : null
          }
          {
            // City
            showMissingData || (program && program.city) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'City'}
                  dataText={program ? program.city : ''}
                />
              </Grid>
            ) : null
          }
          {
            // State
            showMissingData || (program && program.state) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'State'}
                  dataText={program ? program.state : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Zip Code
            showMissingData || (program && program.zip_code) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Code'}
                  dataText={program ? program.zip_code : ''}
                />
              </Grid>
            ) : null
          }
          {
            showMissingData || (program && program.map_url) ? (
              <Grid item xs={12} sm={12} md={12}>
                <a 
                className={classes.customLink}
                target="_blank"
                rel="noopener noreferrer"
                href={`http://maps.google.com/?q=${program.street}. ${program.city}, ${program.state} ${program.zipcode}`}
                >
                  Directions
                </a>
              </Grid>
            ) : null
          }
          {
            showMissingData || (program && program.map_url) ? (
              <Grid item xs={12} sm={12} md={12}>
                <iframe
                  title="program-map"
                  width="100%"
                  height="400"
                  src={program.map_url}>
                </iframe>
              </Grid>
            ) : null
          }
          {
            // Next steps
            showMissingData || (program && program.next_steps) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Next steps for client to take'}
                  dataText={program ? program.next_steps : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Program service cost
            showMissingData || (program && program.payment_service_cost) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Program service cost'}
                  dataText={program ? program.payment_service_cost : ''}
                />
              </Grid>
            ) : null
          }
          {
            showMissingData || (program && program.payment_options) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Payment options'}
                  dataText={program ? program.payment_options : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Eligibility section
            showMissingData || (program && program.age_groups && program.age_groups.length) ||
            (program && program.immigrant_statuses) || (program && program.zip_codes) ||
            (program && program.incomes_percent_poverty_level) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Eligibility" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Age groups
            showMissingData || (program && program.age_groups && program.age_groups.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Age groups'}
                  dataText={program.age_groups}
                />
              </Grid>
            ) : null
          }
          {
            // Immigrant status(es)
            showMissingData || (program && program.immigrant_statuses) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Immigrant status(es)'}
                  dataText={program ? program.immigrant_statuses : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Zip codes
            showMissingData || (program && program.zip_codes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Codes'}
                  dataText={program ? program.zip_codes : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Income
            showMissingData || (program && program.incomes_percent_poverty_level) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Income (% of federal poverty level)'}
                  dataText={program ? `< ${program.incomes_percent_poverty_level}%` : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Requirements section
            showMissingData || (program && program.requires_enrollment_in) ||
            (program && program.other_requirements) || (program && program.documents_required) ||
            (program && program.appointment_required) || (program && program.appointment_notes) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Requirements" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Requires enrollment in
            showMissingData || (program && program.requires_enrollment_in) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Requires enrollment in'}
                  dataText={program ? program.requires_enrollment_in : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Other
            showMissingData || (program && program.other_requirements) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Other'}
                  dataText={program ? program.other_requirements : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Documents required?
            showMissingData || (program && program.documents_required) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Documents required?'}
                  dataText={program ? program.documents_required : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Appointment required?
            showMissingData || (program && program.appointment_required) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Appointment required?'}
                  dataText={program.appointment_required}
                />
              </Grid>
            ) : null
          }
          {
            // Appointment notes
            showMissingData || (program && program.appointment_notes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Appointment notes'}
                  dataText={program ? program.appointment_notes : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Schedule section
            showMissingData || (program && program.schedule && hasSchedule(program.schedule)) || (program && program.schedule_notes) ||
            (program && program.holiday_schedule) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Schedules" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Schedule
            showMissingData || (program && program.schedule && hasSchedule(program.schedule)) ? (
              <Grid item xs={12} sm={12} md={12}>
                <ScheduleData values={program ? program.schedule : []} />
              </Grid>
            ) : null
          }
          {
            // Walk in hours section
            showMissingData || (program && program.walk_in_schedule && hasSchedule(program.walk_in_schedule)) ? (
              <Grid item xs={12} sm={12} md={12}>
              <Label text="Walk in hours" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Walk in hours
            showMissingData || (program && program.walk_in_schedule && hasSchedule(program.walk_in_schedule)) ? (
              <Grid item xs={12} sm={12} md={12}>
                <ScheduleData values={program ? program.walk_in_schedule : []} />
              </Grid>
            ) : null
          }
          {
            // Schedule Notes
            showMissingData || (program && program.schedule_notes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Notes'}
                  dataText={program ? program.schedule_notes : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Holiday Schedule
            showMissingData || (program && program.holiday_schedule) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Holiday Schedule'}
                  dataText={program ? program.holiday_schedule : ''}
                />
              </Grid>
            ) : null
          }
          {
            // services section
            showMissingData || (program && program.service_same_day_intake) ||
            (program && program.intake_notes) || (program && program.crisis) ||
            (program && program.disaster_recovery) || (program && program.transportation) ||
            (program && program.client_consult) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Services" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // intake
            showMissingData || (program && program.service_same_day_intake) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Are services available same day as intake?'}
                  dataText={program.service_same_day_intake}
                />
              </Grid>
            ) : null
          }
          {
            // Intake notes
            showMissingData || (program && program.intake_notes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Intake notes'}
                  dataText={program ? program.intake_notes : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Crisis
            showMissingData || (program && program.crisis) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Crisis?'}
                  dataText={program ? program.crisis : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Disaster recovery
            showMissingData || (program && program.disaster_recovery) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Disaster response and/or recovery?'}
                  dataText={program.disaster_recovery}
                />
              </Grid>
            ) : null
          }
          {
            // Transportation
            showMissingData || (program && program.transportation) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Transportation'}
                  dataText={program ? program.transportation : ''}
                />
              </Grid>
            ) : null
          }
          {
            // client consult
            showMissingData || (program && program.client_consult) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Client consult before completing paperwork?'}
                  dataText={program.client_consult}
                />
              </Grid>
            ) : null
          }
        </Grid>
      </Container>
    );
  }

  return null;
  
}
