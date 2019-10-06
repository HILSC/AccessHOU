import React, {
  useState
} from 'react';
import { Redirect } from 'react-router-dom';

// Material UI components
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

// Custom components
import Label from 'components/Label/Label';
import DataLabel from 'components/DataLabel/DataLabel';
import ScheduleData from 'components/Schedule/ScheduleData';
import ProgramItems from 'components/Program/ProgramItems';

import { 
  formatURL,
  hasSchedule,
} from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyDataStyles';
const useStyles = makeStyles(styles);

export default ({ agency, showMissingData }) => {
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
        <CssBaseline />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Label text={agency.name} variant="h4" color="inherit" />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Label text="General Info" variant="h5" color="primary" />
          </Grid>
          {
            // Website
            showMissingData || (agency && agency.website) ? (
              <Grid item xs={12} sm={12} md={6}>
                <DataLabel
                  labelText={'Website'}
                  dataText={formatURL(agency.website)}
                />
              </Grid>
            ) : null
          }
          {
            // Phone
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
            showMissingData || (agency && agency.schedule && hasSchedule(agency.schedule)) ||
            (agency && agency.schedule_notes) || (agency && agency.holiday_schedule) ? (
              <Grid item xs={12} sm={12} md={12}>
                <Label text="Schedules" variant="h5" color="primary" />
              </Grid>
            ) : null
          }
          {
            // Schedule
            showMissingData || (agency && agency.schedule && hasSchedule(agency.schedule)) ? (
              <Grid item xs={12} sm={12} md={6}>
                <ScheduleData values={agency.schedule ? agency.schedule : []} />
              </Grid>
            ) : null
          }
          {
            // Schedule notes
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
            showMissingData || (agency && agency.programs.length) ? (
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
