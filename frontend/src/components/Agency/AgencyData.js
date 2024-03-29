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
  ACTION_MESSAGE,
  AGE_GROUPS,
  IMMIGRATION_STATUSES,
  IDS,
  PROOF_OF_ADDRESS,
  LANGUAGES,
  AVAILABLE_INTERPRETATION,
  IAI_MESSAGE
} from 'constants.js';

import {
  formatURL,
  hasSchedule,
  sameSchedule,
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
    const url = `/program/${selectedProgram.agency}/${selectedProgram.slug}`
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
              <span className={ agency.hilsc_verified ? classes.verifiedTrue : classes.verifiedFalse}>
                HILSC Network Partner</span>
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
              showMissingData || agency ? (
                <Grid item xs={12} sm={12} md={12}>
                  <DataLabel
                    labelText={'Address'}
                    dataText={`${agency.street ? agency.street + '. ' : ''}${agency.city ? agency.city + ', ' : ''}${agency.state ? agency.state + ' ' : ''}${agency.zip_code ? agency.zip_code : ''}`}
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
                href={`http://maps.google.com/?q=${agency.street}. ${agency.city}, ${agency.state} ${agency.zip_code}`}
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
            (queueAgencyData && queueAgencyData.age_groups && queueAgencyData.age_groups.length) ||
            (queueAgencyData && queueAgencyData.gender) ||
            (queueAgencyData && queueAgencyData.zip_codes) ||
            (queueAgencyData && queueAgencyData.immigration_statuses && queueAgencyData.immigration_statuses.length) ||
            showMissingData || (agency && agency.age_groups && agency.age_groups.length) ||
            (agency && agency.gender) || (agency && agency.zip_codes) ||
            (agency && agency.immigration_statuses && agency.immigration_statuses.length) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Eligibility" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Age Groups
            queueAgencyData && JSON.stringify(queueAgencyData.age_groups) !== JSON.stringify(agency.age_groups) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={AGE_GROUPS}
                  labelText={'Age groups'}
                  dataText={queueAgencyData.age_groups !== '' ? queueAgencyData.age_groups : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.age_groups !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.age_groups && agency.age_groups.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={AGE_GROUPS}
                  labelText={'Age groups'}
                  dataText={agency.age_groups}
                />
              </Grid>
            ) : null
          }
          { /*
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
          */}
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
            queueAgencyData && JSON.stringify(queueAgencyData.immigration_statuses) !== JSON.stringify(agency.immigration_statuses) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IMMIGRATION_STATUSES}
                  labelText={'Immigration status(es)'}
                  dataText={queueAgencyData.immigration_statuses !== '' ? queueAgencyData.immigration_statuses : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.immigration_statuses !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.immigration_statuses && agency.immigration_statuses.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IMMIGRATION_STATUSES}
                  labelText={'Immigration status(es)'}
                  dataText={agency.immigration_statuses}
                />
              </Grid>
            ) : null
          }
          {
            // Requirements section
            (queueAgencyData && queueAgencyData.accepted_ids_current && queueAgencyData.accepted_ids_current.length) ||
            (queueAgencyData && queueAgencyData.accepted_ids_expired && queueAgencyData.accepted_ids_expired.length) ||
            (queueAgencyData && queueAgencyData.notes) ||
            (queueAgencyData && queueAgencyData.proof_of_address && queueAgencyData.proof_of_address.length) ||
            showMissingData || (agency && agency.accepted_ids_current && agency.accepted_ids_current.length) ||
            (agency && agency.accepted_ids_expired && agency.accepted_ids_expired.length) || (agency && agency.notes) ||
            (agency && agency.proof_of_address && agency.proof_of_address.length && agency.proof_of_address[0] !== null) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Requirements" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Accepted IDS current
            queueAgencyData && JSON.stringify(queueAgencyData.accepted_ids_current) !== JSON.stringify(agency.accepted_ids_current) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IDS}
                  labelText={'IDs accepted -- current'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.accepted_ids_current !== '' ? queueAgencyData.accepted_ids_current : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.accepted_ids_current !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#999'}} href="/user-manual#iiap">Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.accepted_ids_current && agency.accepted_ids_current.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IDS}
                  labelText={'IDs accepted -- current'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.accepted_ids_current}
                />
                <a style={{ fontSize: '14px', color: '#999'}} href="/user-manual#iiap">Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) : null
          }
          {
            // Accepted IDS expired
            queueAgencyData && JSON.stringify(queueAgencyData.accepted_ids_expired) !== JSON.stringify(agency.accepted_ids_expired) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IDS}
                  labelText={'IDs accepted -- expired'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.accepted_ids_expired !== '' ? queueAgencyData.accepted_ids_expired : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.accepted_ids_expired !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#999'}} href="/user-manual#iiap">Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.accepted_ids_expired && agency.accepted_ids_expired.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={IDS}
                  labelText={'IDs accepted -- expired'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.accepted_ids_expired}
                />
                <a style={{ fontSize: '14px', color: '#999'}} href="/user-manual#iiap">Informs Immigrant Accessibility Profile</a>
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
            queueAgencyData && JSON.stringify(queueAgencyData.proof_of_address) !== JSON.stringify(agency.proof_of_address) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={PROOF_OF_ADDRESS}
                  labelText={'Proof of address?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.proof_of_address !== '' ? queueAgencyData.proof_of_address : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.proof_of_address !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.proof_of_address && agency.proof_of_address.length && agency.proof_of_address[0] !== null) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={PROOF_OF_ADDRESS}
                  labelText={'Proof of address?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.proof_of_address}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
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
            queueAgencyData && hasSchedule(queueAgencyData.schedule) ? (
              <Grid item xs={12} sm={12} md={6}>
                <ScheduleData
                  values={queueAgencyData.schedule ? queueAgencyData.schedule : []}
                  dataTextClass={sameSchedule(queueAgencyData.schedule, agency.schedule) ? null : ACTION_CLASS.CHANGED}
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
            (queueAgencyData && queueAgencyData.languages && queueAgencyData.languages.length) ||
            (queueAgencyData && queueAgencyData.documents_languages && queueAgencyData.documents_languages.length) ||
            (queueAgencyData && queueAgencyData.website_languages && queueAgencyData.website_languages.length) ||
            (queueAgencyData && queueAgencyData.frontline_staff_languages && queueAgencyData.frontline_staff_languages.length) ||
            (queueAgencyData && queueAgencyData.interpretations_available && queueAgencyData.interpretations_available.length) ||
            showMissingData || (agency && agency.languages && agency.languages.length) ||
            (agency && agency.documents_languages && agency.documents_languages.length) ||
            (agency && agency.website_languages && agency.website_languages.length) ||
            (agency && agency.frontline_staff_languages && agency.frontline_staff_languages.length) ||
            (agency && agency.interpretations_available && agency.interpretations_available.length) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Languages" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Agency languages
            queueAgencyData && JSON.stringify(queueAgencyData.languages) !== JSON.stringify(agency.languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Agency'}
                  dataText={queueAgencyData.languages !== '' ? queueAgencyData.languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
              </Grid>
            ) :
            showMissingData || (agency && agency.languages && agency.languages.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Agency'}
                  dataText={agency.languages}
                />
              </Grid>
            ) : null
          }
          {
            // Documents languages
            queueAgencyData && JSON.stringify(queueAgencyData.documents_languages) !== JSON.stringify(agency.documents_languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Documents'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.documents_languages !== '' ? queueAgencyData.documents_languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.documents_languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.documents_languages && agency.documents_languages.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Documents'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.documents_languages}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) : null
          }
          {
            // Website languages
            queueAgencyData && JSON.stringify(queueAgencyData.website_languages) !== JSON.stringify(agency.website_languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Website'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.website_languages !== '' ? queueAgencyData.website_languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.website_languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.website_languages && agency.website_languages.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Website'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.website_languages}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) : null
          }
          {
            // Frontline staff languages
            queueAgencyData && JSON.stringify(queueAgencyData.frontline_staff_languages) !== JSON.stringify(agency.frontline_staff_languages) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Frontline staff'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.frontline_staff_languages !== '' ? queueAgencyData.frontline_staff_languages : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.frontline_staff_languages !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.frontline_staff_languages && agency.frontline_staff_languages.length) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={LANGUAGES}
                  labelText={'Frontline staff'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.frontline_staff_languages}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) : null
          }
          {
            // Interprestation available
            queueAgencyData && JSON.stringify(queueAgencyData.interpretations_available) !== JSON.stringify(agency.interpretations_available) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  isAList={true}
                  listOptions={AVAILABLE_INTERPRETATION}
                  labelText={'Interpretation available?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.interpretations_available !== '' ? queueAgencyData.interpretations_available : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.interpretations_available !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.interpretations_available && agency.interpretations_available.length) ? (
              <Grid item xs={12} sm={12} md={12}>
                <DataLabel
                  isAList={true}
                  listOptions={AVAILABLE_INTERPRETATION}
                  labelText={'Interpretation available?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.interpretations_available}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
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
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.assistance_with_forms !== '' ? queueAgencyData.assistance_with_forms : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.assistance_with_forms !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.assistance_with_forms) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Assitance to fill out intake forms?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.assistance_with_forms}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) : null
          }
          {
            // Visual aids
            queueAgencyData && queueAgencyData.visual_aids !== agency.visual_aids ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Visual aids for low-literacy clients?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.visual_aids !== '' ? queueAgencyData.visual_aids : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.visual_aids !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.visual_aids) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Visual aids for low-literacy clients?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.visual_aids}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
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
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.response_requests !== '' ? queueAgencyData.response_requests : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.response_requests !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.response_requests) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Response to Immigrations and Customs Enforcement requests?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.response_requests}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) : null
          }
          {
            // Staff cultural
            queueAgencyData && queueAgencyData.cultural_training !== agency.cultural_training ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Staff cultural competency/effectiveness training?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={queueAgencyData.cultural_training !== '' ? queueAgencyData.cultural_training : ACTION_MESSAGE.DELETED }
                  dataTextClass={queueAgencyData.cultural_training !== '' ? ACTION_CLASS.CHANGED : ACTION_CLASS.DELETED }
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
              </Grid>
            ) :
            showMissingData || (agency && agency.cultural_training) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Staff cultural competency/effectiveness training?'}
                  // labelInfo={{show: true, msg: IAI_MESSAGE}}
                  dataText={agency.cultural_training}
                />
                <a style={{ fontSize: '14px', color: '#bbb', marginTop: '7px', display: 'block'}} href="/user-manual#iiap">
                Informs Immigrant Accessibility Profile</a>
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
