import React from 'react';
import { NavLink } from "react-router-dom";

// Material UI Components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Custom Components
import Label from 'components/Label/Label';
import DataLabel from 'components/DataLabel/DataLabel';
import ScheduleData from 'components/Schedule/ScheduleData';

// Constants
import {
  ACTION_CLASS,
  ACTION_MESSAGE,
  PROGRAM_SERVICES,
  AGE_GROUPS,
  IMMIGRATION_STATUSES,
  CRISIS,
  LANGUAGES,
  IAI_MESSAGE,
} from 'constants.js';

// Utils
import { 
  formatURL,
  hasSchedule,
  sameSchedule,
} from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramDataStyles';
const useStyles = makeStyles(styles);

export default ({ program, showMissingData, queueProgramData=null }) => {
  const classes = useStyles();
  if (program) {
    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            {
              queueProgramData && queueProgramData.name !== program.name ? (
                <NavLink to={`/program/${program.slug}`} target="_blank" className={classes.programCustomLink}>
                  <Typography className={classes.infoChanged}>
                    {queueProgramData.name}
                  </Typography>
                </NavLink>
              ) : (
                <NavLink to={`/program/${program.slug}`} target="_blank" className={classes.programCustomLink}>
                  <Typography className={classes.programTitle}>
                    {program.name}
                  </Typography>
                </NavLink>
              )
            }
            <NavLink to={`/agency/${program.agency_slug}`} target="_blank" className={classes.agencyCustomLink}>
              {`A program from: ${program.agency_name}`}
            </NavLink>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Label text="General Info" variant="h5" color="primary" />
          </Grid>
          {
            // Description
            queueProgramData && queueProgramData.description !== program.description ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Description'}
                  dataText={queueProgramData.description !== '' ? queueProgramData.description : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.description !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && JSON.stringify(queueProgramData.service_types) !== JSON.stringify(program.service_types) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={PROGRAM_SERVICES}
                  labelText={'Service Types'}
                  dataText={queueProgramData.service_types ? queueProgramData.service_types : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.service_types ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.service_types && program.service_types.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={PROGRAM_SERVICES}
                  labelText={'Service Types'}
                  dataText={program ? program.service_types : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Is case management Provided?
            queueProgramData && queueProgramData.case_management_provided !== program.case_management_provided ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Is case management Provided?'}
                  dataText={queueProgramData.case_management_provided ? queueProgramData.case_management_provided : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.case_management_provided ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.case_management_notes !== program.case_management_notes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Case management notes'}
                  dataText={queueProgramData.case_management_notes ? queueProgramData.case_management_notes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.case_management_notes ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.website !== program.website ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Website'}
                  dataText={queueProgramData.website === '' ? ACTION_MESSAGE.DELETED : queueProgramData.website}
                  dataTextWithFormat={queueProgramData.website !== '' ? formatURL(queueProgramData.website) : null}
                  dataTextClass={queueProgramData.website !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.website) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Website'}
                  dataText={program.website}
                  dataTextWithFormat={formatURL(program.website)}
                />
              </Grid>
            ) : null
          }
          {
            // Phone
            queueProgramData && queueProgramData.phone !== program.phone ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Phone'}
                  dataText={queueProgramData.phone ? queueProgramData.phone : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.phone ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.street !== program.street ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Street'}
                  dataText={queueProgramData.street ? queueProgramData.street : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.street ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || program ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Address'}
                  dataText={`${program.street ? program.street + '. ' : ''}${program.city ? program.city + ', ' : ''}${program.state ? program.state + ' ' : ''}${program.zip_code ? program.zip_code : ''}`}
                />
              </Grid>
            ) : null
          }
          {
            // City
            queueProgramData && queueProgramData.city !== program.city ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'City'}
                  dataText={queueProgramData.city ? queueProgramData.city : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.city ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) : null
          }
          {
            // State
            queueProgramData && queueProgramData.state !== program.state ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'State'}
                  dataText={queueProgramData.state ? queueProgramData.state : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.state ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) : null
          }
          {
            // Zip Code
            queueProgramData && queueProgramData.zip_code !== program.zip_code ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Code'}
                  dataText={queueProgramData.zip_code ? queueProgramData.zip_code : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.zip_code ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) : null
          }
          {
            // Directions
            queueProgramData ? null :
            showMissingData || (program && program.map_url) ? (
              <Grid item xs={12} sm={12} md={12}>
                <a 
                className={classes.customLink}
                target="_blank"
                rel="noopener noreferrer"
                href={`http://maps.google.com/?q=${program.street}. ${program.city}, ${program.state} ${program.zip_code}`}
                >
                  Directions
                </a>
              </Grid>
            ) : null
          }
          {
            // Map
            queueProgramData ? null :
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
            queueProgramData && queueProgramData.next_steps !== program.next_steps ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Next steps for client to take'}
                  dataText={queueProgramData.next_steps ? queueProgramData.next_steps : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.next_steps ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.payment_service_cost !== program.payment_service_cost ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Program service cost'}
                  dataText={queueProgramData.payment_service_cost ? queueProgramData.payment_service_cost : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.payment_service_cost ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            // Payment options
            queueProgramData && queueProgramData.payment_options !== program.payment_options ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Payment options'}
                  dataText={queueProgramData.payment_options ? queueProgramData.payment_options : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.payment_options ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            (queueProgramData && queueProgramData.age_groups && queueProgramData.age_groups.length) ||
            (queueProgramData && queueProgramData.immigrant_statuses && queueProgramData.immigrant_statuses.length) ||
            (queueProgramData && queueProgramData.zip_codes) ||
            (queueProgramData && queueProgramData.incomes_percent_poverty_level) ||
            showMissingData || (program && program.age_groups && program.age_groups.length) ||
            (program && program.immigrant_statuses && program.immigrant_statuses.length) || (program && program.zip_codes) ||
            (program && program.incomes_percent_poverty_level) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Eligibility" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Age groups
            queueProgramData && JSON.stringify(queueProgramData.age_groups) !== JSON.stringify(program.age_groups) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={AGE_GROUPS}
                  labelText={'Age groups'}
                  dataText={queueProgramData.age_groups ? queueProgramData.age_groups : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.age_groups ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.age_groups && program.age_groups.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={AGE_GROUPS}
                  labelText={'Age groups'}
                  dataText={program.age_groups}
                />
              </Grid>
            ) : null
          }
          {
            // Immigrant status(es)
            queueProgramData && JSON.stringify(queueProgramData.immigrant_statuses) !== JSON.stringify(program.immigrant_statuses) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IMMIGRATION_STATUSES}
                  labelText={'Immigrant status(es)'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueProgramData.immigrant_statuses ? queueProgramData.immigrant_statuses : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.immigrant_statuses ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.immigrant_statuses && program.immigrant_statuses.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IMMIGRATION_STATUSES}
                  labelText={'Immigrant status(es)'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={program ? program.immigrant_statuses : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Zip codes
            queueProgramData && queueProgramData.zip_codes !== program.zip_codes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Codes'}
                  dataText={queueProgramData.zip_codes ? queueProgramData.zip_codes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.zip_codes ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.incomes_percent_poverty_level !== program.incomes_percent_poverty_level ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Income (% of federal poverty level)'}
                  dataText={queueProgramData.incomes_percent_poverty_level ? queueProgramData.incomes_percent_poverty_level : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.incomes_percent_poverty_level ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            (queueProgramData && queueProgramData.requires_enrollment_in) ||
            (queueProgramData && queueProgramData.other_requirements) ||
            (queueProgramData && queueProgramData.documents_required) ||
            (queueProgramData && queueProgramData.appointment_required) ||
            (queueProgramData && queueProgramData.appointment_notes) ||
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
            queueProgramData && queueProgramData.requires_enrollment_in !== program.requires_enrollment_in ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Requires enrollment in'}
                  dataText={queueProgramData.requires_enrollment_in ? queueProgramData.requires_enrollment_in : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.requires_enrollment_in ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.other_requirements !== program.other_requirements ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Other'}
                  dataText={queueProgramData.other_requirements ? queueProgramData.other_requirements : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.other_requirements ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.documents_required !== program.documents_required ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Documents required?'}
                  dataText={queueProgramData.documents_required ? queueProgramData.documents_required : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.documents_required ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.appointment_required !== program.appointment_required ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Appointment required?'}
                  dataText={queueProgramData.appointment_required ? queueProgramData.appointment_required : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.appointment_required ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.appointment_notes !== program.appointment_notes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Appointment notes'}
                  dataText={queueProgramData.appointment_notes ? queueProgramData.appointment_notes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.appointment_notes ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            (queueProgramData && hasSchedule(queueProgramData.schedule)) ||
            (queueProgramData && queueProgramData.schedule_notes) ||
            (queueProgramData && queueProgramData.holiday_schedule) ||
            showMissingData || (program && program.schedule && hasSchedule(program.schedule)) ||
            (program && program.schedule_notes) ||
            (program && program.holiday_schedule) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Schedules" variant="h5" color="primary" labelInfo={{show: true, msg: IAI_MESSAGE}} />
              </Grid>
            ) : null
          }
          {
            // Schedule
            queueProgramData && hasSchedule(queueProgramData.schedule) ? (
              <Grid item xs={12} sm={12} md={6}>
                <ScheduleData
                  values={queueProgramData.schedule ? queueProgramData.schedule : []} 
                  dataTextClass={sameSchedule(queueProgramData.schedule, program.schedule) ? null : ACTION_CLASS.CHANGED}
                />
              </Grid>
            ) :
            showMissingData || (program && program.schedule && hasSchedule(program.schedule)) ? (
              <Grid item xs={12} sm={12} md={12}>
                <ScheduleData values={program ? program.schedule : []} />
              </Grid>
            ) : null
          }
          {
            // Walk in hours section
            (queueProgramData && hasSchedule(queueProgramData.walk_in_schedule)) ||
            showMissingData || (program && program.walk_in_schedule && hasSchedule(program.walk_in_schedule)) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Walk in hours" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Walk in hours
            queueProgramData && hasSchedule(queueProgramData.walk_in_schedule) ? (
              <Grid item xs={12} sm={12} md={6}>
                <ScheduleData
                  values={queueProgramData.walk_in_schedule ? queueProgramData.walk_in_schedule : []} 
                  dataTextClass={sameSchedule(queueProgramData.walk_in_schedule, program.walk_in_schedule) ? null : ACTION_CLASS.CHANGED}
                />
              </Grid>
            ) :
            showMissingData || (program && program.walk_in_schedule && hasSchedule(program.walk_in_schedule)) ? (
              <Grid item xs={12} sm={12} md={12}>
                <ScheduleData values={program ? program.walk_in_schedule : []} />
              </Grid>
            ) : null
          }
          {
            // Schedule Notes
            queueProgramData && queueProgramData.schedule_notes !== program.schedule_notes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Notes'}
                  dataText={queueProgramData.schedule_notes ? queueProgramData.schedule_notes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.schedule_notes ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.holiday_schedule !== program.holiday_schedule ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Holiday Schedule'}
                  dataText={queueProgramData.holiday_schedule ? queueProgramData.holiday_schedule : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.holiday_schedule ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            // Language section
            (queueProgramData && queueProgramData.languages && queueProgramData.languages.lenth) ||
            showMissingData || (program && program.languages) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Program Languages" variant="h5" color="primary" />
              </Grid>
            ): null
          }
          {
            // Crisis
            queueProgramData && JSON.stringify(queueProgramData.languages) !== JSON.stringify(program.languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Languages'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueProgramData.languages ? queueProgramData.languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.languages ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Languages'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={program ? program.languages : ''}
                />
              </Grid>
            ) : null
          }
          {
            // services section
            (queueProgramData && queueProgramData.service_same_day_intake) ||
            (queueProgramData && queueProgramData.intake_notes) ||
            (queueProgramData && queueProgramData.crisis && queueProgramData.crisis.length) ||
            (queueProgramData && queueProgramData.disaster_recovery) ||
            (queueProgramData && queueProgramData.transportation) ||
            (queueProgramData && queueProgramData.client_consult) ||
            showMissingData || (program && program.service_same_day_intake) ||
            (program && program.intake_notes) || (program && program.crisis && program.crisis.length) ||
            (program && program.disaster_recovery) || (program && program.transportation) ||
            (program && program.client_consult) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Services" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // intake
            queueProgramData && queueProgramData.service_same_day_intake !== program.service_same_day_intake ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Are services available same day as intake?'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueProgramData.service_same_day_intake ? queueProgramData.service_same_day_intake : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.service_same_day_intake ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.service_same_day_intake) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Are services available same day as intake?'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={program.service_same_day_intake}
                />
              </Grid>
            ) : null
          }
          {
            // Intake notes
            queueProgramData && queueProgramData.intake_notes !== program.intake_notes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Intake notes'}
                  dataText={queueProgramData.intake_notes ? queueProgramData.intake_notes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.intake_notes ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && JSON.stringify(queueProgramData.crisis) !== JSON.stringify(program.crisis) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={CRISIS}
                  labelText={'Crisis?'}
                  dataText={queueProgramData.crisis ? queueProgramData.crisis : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.crisis ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.crisis) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={CRISIS}
                  labelText={'Crisis?'}
                  dataText={program ? program.crisis : ''}
                />
              </Grid>
            ) : null
          }
          {
            // Disaster recovery
            queueProgramData && queueProgramData.disaster_recovery !== program.disaster_recovery ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Disaster response and/or recovery?'}
                  dataText={queueProgramData.disaster_recovery ? queueProgramData.disaster_recovery : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.disaster_recovery ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.transportation !== program.transportation ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Transportation'}
                  dataText={queueProgramData.transportation ? queueProgramData.transportation : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.transportation ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
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
            queueProgramData && queueProgramData.client_consult !== program.client_consult ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Client consult before completing paperwork?'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueProgramData.client_consult ? queueProgramData.client_consult : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueProgramData.client_consult ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (program && program.client_consult) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  labelText={'Client consult before completing paperwork?'}
                  labelInfo={{show: true, msg: IAI_MESSAGE}}
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
