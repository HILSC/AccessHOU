import React , {
  useEffect,
  useState,
  useRef,
} from 'react';

import MomentUtils from '@date-io/moment';

// Material UI Components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// Custom hooks
import useDebounce from 'customhooks/useDebounce';

// Custom Components
import DataLabel from 'components/DataLabel/DataLabel';
import Autocomplete from 'components/Autocomplete/Autocomplete';
import CustomInput from "components/CustomInput/CustomInput";
import Label from "components/Label/Label";

// API
import {
  getAgencies,
  getPrograms,
  getAgency,
  getProgram,
} from 'api';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AvocacyReportFormStyles';
const useStyles = makeStyles(styles);

export default ({ handleSave, userName, entity, entityId, agencyId }) => {
  const classes = useStyles();

  const descriptionRef = useRef(null);

  const moment = new MomentUtils({ locale: "en" });

  // Check why is not updating
  const [values, setValues] = useState({
    entity_reported: 'agency',
    incident_time: moment.moment().format('LLL'),
    incident_date: moment.moment().format('L'),
    query_string: false,
    entity_reported_id: null,
    entity_name: null,
  });

  const [entityError, setEntityError] = useState({error: false, message: ''}); 
  const [descriptionError, setDescriptionError] = useState({error: false, message: ''});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [resultSuggestions, setResultSuggestions] = useState([])
  const [selectedDate, setSelectedDate] = useState(values.incident_date);
  const [selectedTime, setSelectedTime] = useState(values.incident_time);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // Get agency/program based on props
  useEffect(()=> {
    if(entity && entityId) {
      if(entity === 'agency'){
        getAgency({property: "id", value: entityId}).then((result) => {
          setValues(data => ({
            ...data,
            entity_reported_id: result.data.id,
            entity_name: result.data.name,
            query_string: true,
          }));
        });
      }else if(entity === 'program'){
        getProgram({property: "id", value: entityId, agency: agencyId}).then((result) => {
          setValues(data => ({
            ...data,
            entity_reported_id: result.data.id,
            entity_name: `${result.data.name} (${result.data.agency_name})`,
            query_string: true,
          }));
        });
      }
    }
  }, [entity, entityId, agencyId]);

  // Get agencies/programs based on search
  useEffect(() => {
    if (debouncedSearchTerm) {
      if (values.entity_reported === 'agency') {
        getAgencies({
          property: 'name',
          value: searchTerm,
          page: 1
        }).then(results => {
          if(Array.isArray(results.data.results) && results.data.results.length){
            const suggestions = results.data.results.map(entity => ({
              value: entity.pk,
              label: entity.fields.name
            }));
            setResultSuggestions(suggestions);
          }
        });
      } else if (values.entity_reported === 'program') {
        getPrograms({
          property: 'name',
          value: searchTerm,
          page: 1
        }).then(results => {
          if(Array.isArray(results.data.programs) && results.data.programs.length){
            const suggestions = results.data.programs.map(program => ({
              value: program.id,
              label: `${program.name} - (${program.agency_name})`
            }));
            setResultSuggestions(suggestions);
          }
        });
      }
      
    }
  }, [debouncedSearchTerm, searchTerm, values]);


  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  const isFormValid = () => {
    if (!values['entity_reported_id'] ||
      values['entity_reported_id'] === '') {
        setEntityError(() => ({error: true, message: "Please select entity of issue"}));
        return false;
    }else{
      setEntityError(() => ({error: false, message: ''}));
    }

    if (!values['description'] ||
      values['description'].trim() === '') {
        descriptionRef.current.focus();
        setDescriptionError(() => ({error: true, message: "Please enter a description."}));
        return false;
    }else{
      setDescriptionError(() => ({error: false, message: ''}));
    }

    return true;
  }

  const handleDateChange = date => {
    const dateOfIncident = date.format('L');
    setSelectedDate(dateOfIncident);
    setValues(data => ({
      ...data,
      incident_date: dateOfIncident
    }));
  };

  const handleTimeChange = date => {
    const timeOfIncident = date.format('LLL');
    setSelectedTime(timeOfIncident);
    setValues(data => ({
      ...data,
      incident_time: timeOfIncident
    }));
  }

  const handleSelect = (entitySelected) => {
    setValues(data => ({
      ...data,
      entity_reported_id: entitySelected.value
    }));
  };

  const handleSearch = (searchText) => {
    setSearchTerm(searchText);
  }

  const handleSubmit =  async (event) => {
    if (event) event.preventDefault();

    if (isFormValid()) {
      handleSave(values);
    }
  }

  return (
    <Container>
      <Typography component="h4" variant="h4">
        Advocacy Report
      </Typography>
      <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="* Required fields" variant="caption" color="textSecondary" />
            </Grid>
            {
              values.query_string && entity && values.entity_name ? (
                <Grid item xs={12} sm={12} md={12}>
                  <DataLabel
                    labelText={entity.charAt(0).toUpperCase() + entity.slice(1)}
                    dataText={values.entity_name}
                  />
                </Grid>
              ) : (
                <React.Fragment>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" classes={{
                        root: classes.customLabel,
                      }} filled={true}>Please select entity of issue *</FormLabel>
                      <RadioGroup defaultValue={values.entity_reported} name="entity_reported">
                        <FormControlLabel value="agency" control={<Radio onChange={handleChange} />} label="Agency" />
                        <FormControlLabel value="program" control={<Radio onChange={handleChange} />} label="Program" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                  <Autocomplete
                    placeholder={`Enter name of the ${values.entity_reported} of issue *`}
                    suggestions={resultSuggestions}
                    handleSelect={handleSelect}
                    handleChange={handleSearch}
                  />
                  {
                    entityError.message && !values.entityID ? (
                      <FormHelperText classes={{
                        root: classes.helperText
                      }}>{entityError.message}</FormHelperText>
                    ) : null
                  }
                </Grid>
                </React.Fragment>
              )
            }
            { values.entity_reported_id ?
              (
                <React.Fragment>
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomInput
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        label: "Name *",
                        name: "name",
                        value: userName
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomInput
                      type="phone"
                      labelText="Phone"
                      id="phone"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: handleChange,
                        name: "phone",
                        value: values.phone ? values.phone : '',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="incident_time"
                        label="Time of incident *"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="incident_date"
                        label="Date of incident *"
                        format="MM-D-YYYY"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <CustomInput
                      id="description"
                      errorDetails={{
                        error: descriptionError && descriptionError.error ? true : false,
                        message: descriptionError ? descriptionError.message : '',
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        inputRef: descriptionRef,
                        label: "Issue description *",
                        onChange: handleChange,
                        name: "description",
                        value: values.description ? values.description : '',
                        multiline: true,
                        rows: 3
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <CustomInput
                      id="recommendation"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        label: "Recommended alternative to issue",
                        onChange: handleChange,
                        name: "recommendation",
                        value: values.recommendation ? values.recommendation : '',
                        multiline: true,
                        rows: 3
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                  <div className={classes.buttons}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      className={classes.button}
                    >
                      Save
                    </Button>
                  </div>
                </Grid>
                </React.Fragment>
              ) : null
            }
           
          </Grid>
        </form>
    </Container>
  );
}
