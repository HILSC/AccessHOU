import React, {
  useState
} from 'react';
import { NavLink, Redirect } from 'react-router-dom';

// Material UI components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

// Custom components
import Label from 'components/Label/Label';
import DataLabel from 'components/DataLabel/DataLabel';
import ScheduleData from 'components/Schedule/ScheduleData';
import ProgramItems from 'components/Program/ProgramItems';

import {
  ACTION_CLASS,
  ACTION_MESSAGE
} from 'constants.js';

import { 
  formatURL,
  hasSchedule,
} from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyDataStyles';
const useStyles = makeStyles(styles);

export default ({ agency, showMissingData, queueAgencyData=null }) => {
  const classes = useStyles();

  const [selectedProgram, setSelectedProgram] = useState({})

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  }

  if (selectedProgram && selectedProgram.id){
    const url = `/program/${selectedProgram.slug}`
    return <Redirect push to={url} />
  }

  if (agency) {
    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
          {
            queueAgencyData && queueAgencyData.name !== agency.name  ? (
              <NavLink to={`/agency/${agency.slug}`} target="_blank" className={classes.agencyCustomLink}>
                <Label text={queueAgencyData.name} variant="h4" color="inherit" classes={{
                  root: classes.infoChanged
                }} />
              </NavLink>
            ) : (
              <NavLink to={`/agency/${agency.slug}`} target="_blank" className={classes.agencyCustomLink}>
                <Label text={agency.name} variant="h4" color="inherit" />
              </NavLink>
            )
          }
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Label text="General Info" variant="h5" color="primary" />
          </Grid>
          {
            // Website
            queueAgencyData && queueAgencyData.website !== agency.website ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Website'}
                  dataText={queueAgencyData.website === '' ? ACTION_MESSAGE.DELETED : queueAgencyData.website}
                  dataTextWithFormat={queueAgencyData.website !== '' ? formatURL(queueAgencyData.website) : null}
                  dataTextClass={queueAgencyData.website !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.website) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Website'}
                  dataText={agency.website}
                  dataTextWithFormat={formatURL(agency.website)}
                />
              </Grid>
            ) : null
          }
          {
            // Phone
            queueAgencyData && queueAgencyData.phone !== agency.phone ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Phone'}
                  dataText={queueAgencyData.phone !== '' ? queueAgencyData.phone : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.phone !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED}
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.phone) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Phone'}
                  dataText={agency.phone}
                />
              </Grid>
            ) : null
          }
          {
            // Street
            queueAgencyData && queueAgencyData.street !== agency.street ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Street'}
                  dataText={queueAgencyData.street !== '' ? queueAgencyData.street : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.street !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.street) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Street'}
                  dataText={agency.street}
                />
              </Grid>
            ) : null
          }
          {
            // City
            queueAgencyData && queueAgencyData.city !== agency.city ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'City'}
                  dataText={queueAgencyData.city !== '' ? queueAgencyData.city : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.city !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.city) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'City'}
                  dataText={agency.city}
                />
              </Grid>
            ) : null
          }
          {
            // State
            queueAgencyData && queueAgencyData.state !== agency.state ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'State'}
                  dataText={queueAgencyData.state !== '' ? queueAgencyData.state : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.state !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.state) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'State'}
                  dataText={agency.state}
                />
              </Grid>
            ) : null
          }
          {
            // Zip Code
            queueAgencyData && queueAgencyData.zip_code !== agency.zip_code ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Code'}
                  dataText={queueAgencyData.zip_code !== '' ? queueAgencyData.zip_code : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.zip_code !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.zip_code) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Code'}
                  dataText={agency.zip_code}
                />
              </Grid>
            ) : null
          }
          {
            // Directions
            queueAgencyData ? null :
            showMissingData || (agency && agency.map_url) ? (
              <Grid item xs={12} sm={12} md={6}>
                <a 
                className={classes.customLink}
                target="_blank"
                rel="noopener noreferrer"
                href={`http://maps.google.com/?q=${agency.street}. ${agency.city}, ${agency.state} ${agency.zipcode}`}
                >
                  Directions
                </a>
              </Grid>
            ) : null
          }
          {
            // Map
            queueAgencyData ? null :
            showMissingData || (agency && agency.map_url) ? (
              <Grid item xs={12} sm={12} md={12}>
                <iframe
                  title="agency-map"
                  width="100%"
                  height="400"
                  src={agency.map_url}>
                </iframe>
              </Grid>
            ) : null
          }
          {
            // Next Steps
            queueAgencyData && queueAgencyData.next_steps !== agency.next_steps ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Next steps for client to take'}
                  dataText={queueAgencyData.next_steps !== '' ? queueAgencyData.next_steps : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.next_steps !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.next_steps) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Next steps for client to take'}
                  dataText={agency.next_steps}
                />
              </Grid>
            ) : null
          }
          {
            // Payment Options
            queueAgencyData && queueAgencyData.payment_options !== agency.payment_options ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Payment options'}
                  dataText={queueAgencyData.payment_options !== '' ? queueAgencyData.payment_options : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.payment_options !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.payment_options) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Payment options'}
                  dataText={agency.payment_options}
                />
              </Grid>
            ) : null
          }
          {
            // Eligibility section
            (queueAgencyData && queueAgencyData.age_groups) ||
            (queueAgencyData && queueAgencyData.gender) ||
            (queueAgencyData && queueAgencyData.zip_codes) ||
            (queueAgencyData && queueAgencyData.immigration_statuses) ||
            showMissingData || (agency && agency.age_groups) ||
            (agency && agency.gender) || (agency && agency.zip_codes) ||
            (agency && agency.immigration_statuses) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Eligibility" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Age Groups
            queueAgencyData && queueAgencyData.age_groups !== agency.age_groups ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Age groups'}
                  dataText={queueAgencyData.age_groups !== '' ? queueAgencyData.age_groups : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.age_groups !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.age_groups) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Age groups'}
                  dataText={agency.age_groups}
                />
              </Grid>
            ) : null
          }
          {
            // Gender
            queueAgencyData && queueAgencyData.gender !== agency.gender ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Gender'}
                  dataText={queueAgencyData.gender !== '' ? queueAgencyData.gender : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.gender !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.gender) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Gender'}
                  dataText={agency.gender}
                />
              </Grid>
            ) : null
          }
          {
            // Zip Codes
            queueAgencyData && queueAgencyData.zip_codes !== agency.zip_codes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Codes'}
                  dataText={queueAgencyData.zip_codes !== '' ? queueAgencyData.zip_codes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.zip_codes !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.zip_codes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Zip Codes'}
                  dataText={agency.zip_codes}
                />
              </Grid>
            ) : null
          }
          {
            // Immigration Statu(es)
            queueAgencyData && queueAgencyData.immigration_statuses !== agency.immigration_statuses ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Immigration status(es)'}
                  dataText={queueAgencyData.immigration_statuses !== '' ? queueAgencyData.immigration_statuses : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.immigration_statuses !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.immigration_statuses) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Immigration status(es)'}
                  dataText={agency.immigration_statuses}
                />
              </Grid>
            ) : null
          }
          {
            // Requirements section
            (queueAgencyData && queueAgencyData.accepted_ids_current) ||
            (queueAgencyData && queueAgencyData.accepted_ids_expired) ||
            (queueAgencyData && queueAgencyData.notes) ||
            (queueAgencyData && queueAgencyData.proof_of_address) ||
            showMissingData || (agency && agency.accepted_ids_current) ||
            (agency && agency.accepted_ids_expired) || (agency && agency.notes) ||
            (agency && agency.proof_of_address) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Requirements" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Accepted IDS current
            queueAgencyData && queueAgencyData.accepted_ids_current !== agency.accepted_ids_current ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'IDs accepted -- current'}
                  dataText={queueAgencyData.accepted_ids_current !== '' ? queueAgencyData.accepted_ids_current : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.accepted_ids_current !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.accepted_ids_current) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'IDs accepted -- current'}
                  dataText={agency.accepted_ids_current}
                />
              </Grid>
            ) : null
          }
          {
            // Accepted IDS expired
            queueAgencyData && queueAgencyData.accepted_ids_expired !== agency.accepted_ids_expired ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'IDs accepted -- expired'}
                  dataText={queueAgencyData.accepted_ids_expired !== '' ? queueAgencyData.accepted_ids_expired : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.accepted_ids_expired !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.accepted_ids_expired) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'IDs accepted -- expired'}
                  dataText={agency.accepted_ids_expired}
                />
              </Grid>
            ) : null
          }
          {
            // Requirements Notes
            queueAgencyData && queueAgencyData.notes !== agency.notes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Notes'}
                  dataText={queueAgencyData.notes !== '' ? queueAgencyData.notes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.notes !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.notes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Notes'}
                  dataText={agency.notes}
                />
              </Grid>
            ) : null
          }
          {
            // Proof of address
            queueAgencyData && queueAgencyData.proof_of_address !== agency.proof_of_address ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Proof of address?'}
                  dataText={queueAgencyData.proof_of_address !== '' ? queueAgencyData.proof_of_address : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.proof_of_address !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.proof_of_address) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Proof of address?'}
                  dataText={agency.proof_of_address}
                />
              </Grid>
            ) : null
          }
          {
            // Schedule section
            (queueAgencyData && hasSchedule(queueAgencyData.schedule)) ||
            (queueAgencyData && queueAgencyData.schedule_notes) ||
            (queueAgencyData && queueAgencyData.holiday_schedule) ||
            showMissingData || (agency && agency.schedule && hasSchedule(agency.schedule)) ||
            (agency && agency.schedule_notes) || (agency && agency.holiday_schedule) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Schedules" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Schedule
            queueAgencyData && hasSchedule(queueAgencyData.schedule) && queueAgencyData.schedule !== agency.schedule ? (
              <Grid item xs={12} sm={12} md={6}>
                <ScheduleData
                  values={queueAgencyData.schedule ? queueAgencyData.schedule : []} 
                  dataTextClass={ACTION_CLASS.CHANGED}
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.schedule && hasSchedule(agency.schedule)) ? (
              <Grid item xs={12} sm={12} md={6}>
                <ScheduleData values={agency.schedule ? agency.schedule : []} />
              </Grid>
            ) : null
          }
          {
            // Schedule notes
            queueAgencyData && queueAgencyData.schedule_notes !== agency.schedule_notes ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Notes'}
                  dataText={queueAgencyData.schedule_notes !== '' ? queueAgencyData.schedule_notes : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.schedule_notes !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.schedule_notes) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Notes'}
                  dataText={agency.schedule_notes}
                />
              </Grid>
            ) : null
          }
          {
            // Holiday schedule notes
            queueAgencyData && queueAgencyData.holiday_schedule !== agency.holiday_schedule ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Holiday Schedule'}
                  dataText={queueAgencyData.holiday_schedule !== '' ? queueAgencyData.holiday_schedule : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.holiday_schedule !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.holiday_schedule) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Holiday Schedule'}
                  dataText={agency.holiday_schedule}
                />
              </Grid>
            ) : null
          }
          {
            // Languages section
            (queueAgencyData && queueAgencyData.languages) ||
            (queueAgencyData && queueAgencyData.documents_languages) ||
            (queueAgencyData && queueAgencyData.website_languages) ||
            (queueAgencyData && queueAgencyData.frontline_staff_languages) ||
            (queueAgencyData && queueAgencyData.interpretations_available) ||
            showMissingData || (agency && agency.languages) ||
            (agency && agency.documents_languages) || (agency && agency.website_languages) ||
            (agency && agency.frontline_staff_languages) || (agency && agency.interpretations_available) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Languages" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Agency languages
            queueAgencyData && queueAgencyData.languages !== agency.languages ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Agency'}
                  dataText={queueAgencyData.languages !== '' ? queueAgencyData.languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Agency'}
                  dataText={agency.languages}
                />
              </Grid>
            ) : null
          }
          {
            // Documents languages
            queueAgencyData && queueAgencyData.documents_languages !== agency.documents_languages ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Documents'}
                  dataText={queueAgencyData.documents_languages !== '' ? queueAgencyData.documents_languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.documents_languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.documents_languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Documents'}
                  dataText={agency.documents_languages}
                />
              </Grid>
            ) : null
          }
          {
            // Website languages
            queueAgencyData && queueAgencyData.website_languages !== agency.website_languages ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Website'}
                  dataText={queueAgencyData.website_languages !== '' ? queueAgencyData.website_languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.website_languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.website_languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Website'}
                  dataText={agency.website_languages}
                />
              </Grid>
            ) : null
          }
          {
            // Frontline staff languages
            queueAgencyData && queueAgencyData.frontline_staff_languages !== agency.frontline_staff_languages ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Frontline staff'}
                  dataText={queueAgencyData.frontline_staff_languages !== '' ? queueAgencyData.frontline_staff_languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.frontline_staff_languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.frontline_staff_languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Frontline staff'}
                  dataText={agency.frontline_staff_languages}
                />
              </Grid>
            ) : null
          }
          {
            // Interprestation available
            queueAgencyData && queueAgencyData.interpretations_available !== agency.interpretations_available ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  labelText={'Interpretation available?'}
                  dataText={queueAgencyData.interpretations_available !== '' ? queueAgencyData.interpretations_available : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.interpretations_available !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.interpretations_available) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  isAList={true}
                  labelText={'Interpretation available?'}
                  dataText={agency.interpretations_available}
                />
              </Grid>
            ) : null
          }
          {
            // Services section
            (queueAgencyData && queueAgencyData.assistance_with_forms) ||
            (queueAgencyData && queueAgencyData.visual_aids) ||
            (queueAgencyData && queueAgencyData.ada_accessible) ||
            (queueAgencyData && queueAgencyData.response_requests) ||
            (queueAgencyData && queueAgencyData.cultural_training) ||
            showMissingData || (agency && agency.assistance_with_forms) ||
            (agency && agency.visual_aids) || (agency && agency.ada_accessible) ||
            (agency && agency.response_requests) || (agency && agency.cultural_training) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Services" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Assitance fill out intake
            queueAgencyData && queueAgencyData.assistance_with_forms !== agency.assistance_with_forms ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Assitance to fill out intake forms?'}
                  dataText={queueAgencyData.assistance_with_forms !== '' ? queueAgencyData.assistance_with_forms : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.assistance_with_forms !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.assistance_with_forms) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Assitance to fill out intake forms?'}
                  dataText={agency.assistance_with_forms}
                />
              </Grid>
            ) : null
          }
          {
            // Visual aids
            queueAgencyData && queueAgencyData.visual_aids !== agency.visual_aids ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Visual aids for low-literacy clients?'}
                  dataText={queueAgencyData.visual_aids !== '' ? queueAgencyData.visual_aids : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.visual_aids !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.visual_aids) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Visual aids for low-literacy clients?'}
                  dataText={agency.visual_aids}
                />
              </Grid>
            ) : null
          }
          {
            // ADA accesible
            queueAgencyData && queueAgencyData.ada_accessible !== agency.ada_accessible ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'ADA accesible'}
                  dataText={queueAgencyData.ada_accessible !== '' ? queueAgencyData.ada_accessible : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.ada_accessible !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.ada_accessible) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'ADA accesible'}
                  dataText={agency.ada_accessible}
                />
              </Grid>
            ) : null
          }
          {
            // Response requests
            queueAgencyData && queueAgencyData.response_requests !== agency.response_requests ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Response to Immigrations and Customs Enforcement requests?'}
                  dataText={queueAgencyData.response_requests !== '' ? queueAgencyData.response_requests : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.response_requests !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.response_requests) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Response to Immigrations and Customs Enforcement requests?'}
                  dataText={agency.response_requests}
                />
              </Grid>
            ) : null
          }
          {
            // Staff cultural
            queueAgencyData && queueAgencyData.cultural_training !== agency.cultural_training ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Staff cultural competency/effectiveness training?'}
                  dataText={queueAgencyData.cultural_training !== '' ? queueAgencyData.cultural_training : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.cultural_training !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.cultural_training) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Staff cultural competency/effectiveness training?'}
                  dataText={agency.cultural_training}
                />
              </Grid>
            ) : null
          }
          {
            // Programs
            queueAgencyData ? null :
            showMissingData || (agency && agency.programs.length > 0) ? (
              <React.Fragment>
                <Grid item xs={12} sm={12} md={12}>
                  <Label text="Agency programs" variant="h5" color="primary" />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <ProgramItems programs={agency.programs} handleSelect={handleSelectProgram} />
                </Grid>
              </React.Fragment>
            ) : null
          }
        </Grid>
      </Container>
    );
  }

  return null;
  
}
