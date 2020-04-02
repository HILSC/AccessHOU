import React , {
  useState,
  useEffect,
} from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';

import {
  BrowserView,
  MobileView,
} from "react-device-detect";

// API
import { 
  search
} from 'api';

// Material UI components
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TuneIcon from '@material-ui/icons/Tune';
import HelpIcon from '@material-ui/icons/Help';
import Grow from '@material-ui/core/Grow';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClearIcon from '@material-ui/icons/Clear';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Custom components
import ResultItem from 'components/Result/ResultItem';
import Alert from 'components/Alert/Alert';
//import EntityOptions from 'components/EntityOptions/EntityOptions';

import {
  PROGRAM_SERVICES,
  LANGUAGES,
} from "constants.js";

// Styles
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styles from './ResultsStyles';
const useStyles = makeStyles(styles);

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: "\"Roboto Slab\", \"serif\", serif",
    fontSize: 14,
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const getResults = (filters) => {
  const searchFilters = {
    search: filters.search,
    entity: filters.entity,
    serviceType: filters.serviceType,
    immigrationStatus: filters.immigrationStatus,
    zipCode: filters.zipCode,
    radius: filters.radius,
    incomeEligibility: filters.incomeEligibility,
    immigrantAccProfile: filters.immigrantAccProfile,
    walkInHours: filters.walkInHours ? 1 : 0,
    programLanguages: filters.programLanguages,
    adaAccessible: filters.adaAccessible ? 1 : 0,
    page: filters.page ? filters.page : 1
  }

  if(filters.HILSCVerified) {
    searchFilters['HILSCVerified'] = 1;
  }else if(filters.HILSCVerified === false){
    searchFilters['HILSCVerified'] = 0
  }

  return search({...searchFilters});
}

const removePropertyFromObject = (values, key_name) => {
  delete values[key_name];
  return values;
}

export default ({ match, location }) => {
  const classes = useStyles();
  const [goProgram, setGoProgram] = useState({go: false, slug: ''})
  const [zipCode, setZipCode] = useState();
  const [results, setResults] = useState({
    agencies: [],
    isSearching: true,
  });

  const params = queryString.parse(location.search);
  const keyword = params.keyword;
  const entity = params.entity;
  const serviceType = params.service ? [params.service] : [];
  const [newSearch, setNewSearch] = useState(keyword);
  const [entitySearch, setEntitySearch] = useState(entity);
  const [showMoreFilters, setShowMorefilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: newSearch,
    entity: entitySearch,
    serviceType: serviceType,
    immigrationStatus: null,
    zipCode: null,
    radius: null,
    incomeEligibility: null,
    immigrantAccProfile: null,
    walkInHours: false,
    programLanguages: [],
    adaAccessible: false,
  });

  const loadMoreData = () => {
    getResults({...filters, zipCode: zipCode, page: results.page + 1, emergency_mode: results.emergency_mode}).then(resultSet => {
      setResults(data => ({
        ...data,
        agencies: [...results.agencies, ...resultSet.data.results],
        totalRecords: resultSet.data.total_records,
        totalPages: resultSet.data.total_pages,
        page: resultSet.data.page,
        hasNext: resultSet.data.has_next,
        hasPrev: resultSet.data.has_prev,
        emergencyMode: resultSet.data.emergency_mode
      }));
    });
  }

  // Call search with filters
  useEffect(() => {
    getResults(filters).then(resultSet => {
      setResults(data => ({
        ...data,
        agencies: resultSet.data.results,
        isSearching: false,
        totalRecords: resultSet.data.total_records,
        totalPages: resultSet.data.total_pages,
        page: resultSet.data.page,
        hasNext: resultSet.data.has_next,
        hasPrev: resultSet.data.has_prev,
        emergencyMode: resultSet.data.emergency_mode
      }));
    });
  }, [
    filters,
    filters.search,
    filters.entitySearch,
    filters.HILSCVerified,
    filters.serviceType,
    filters.immigrationStatus,
    filters.zipCode,
    filters.radius,
    filters.incomeEligibility,
    filters.immigrantAccProfile,
    filters.walkInHours,
    filters.programLanguages,
    filters.adaAccessible
  ]);

  const handleKeywordSearch = () => {
    setResults(data => ({
      ...data,
      isSearching: true
    }));
    setFilters(values => ({ ...values, 'search': newSearch }));
  }

  const handleKeyPress = (event) => {
    event.persist();
    if (event.key === 'Enter') {
      setResults(data => ({
        ...data,
        isSearching: true
      }));
      setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
    }
  }

  const handleChange = (event) => {
    event.persist();
    if (event.target.name === 'search') {
      setNewSearch(event.target.value);
    } else if (event.target.name === 'zipCode'){
      setZipCode(event.target.value);
      if (event.target.value.length === 5) {
        setResults(data => ({
          ...data,
          isSearching: true
        }));
        setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
      }
    } else if (event.target.name === 'immigrationStatus') {
      setResults(data => ({
        ...data,
        isSearching: true
      }));
      if (event.target.value === 'immigration'){
        setFilters(values => (
          {
            ...removePropertyFromObject(values, 'immigrationStatus')
          }
        ));
      } else {
        setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
      }
    } else if (event.target.name === 'radius') {
      setResults(data => ({
        ...data,
        isSearching: true
      }));
      if (event.target.value === 'immigration'){
        setFilters(values => (
          {
            ...removePropertyFromObject(values, 'immigrationStatus')
          }
        ));
      } else {
        setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
      }
    } else if (event.target.name === 'incomeEligibility') {
      setResults(data => ({
        ...data,
        isSearching: true
      }));
      if (event.target.value === 'income'){
        setFilters(values => (
          {
            ...removePropertyFromObject(values, 'incomeEligibility')
          }
        ));
      } else {
        setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
      }
    } else if (event.target.name === 'immigrantAccProfile') {
      setResults(data => ({
        ...data,
        isSearching: true
      }));
      if (event.target.value === 'profile'){
        setFilters(values => (
          {
            ...removePropertyFromObject(values, 'immigrantAccProfile')
          }
        ));
      } else {
        setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
      }
    } else {
      setResults(data => ({
        ...data,
        isSearching: true
      }));
      setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
    }
  };

  const handleShowMoreFilters = () => {
    setShowMorefilters(!showMoreFilters);
  }

  const handleWalkInHours = () => {
    setResults(data => ({
      ...data,
      isSearching: true
    }));

    setFilters(data => ({
      ...data,
      walkInHours: !data.walkInHours
    }));
  }

  const handleADAAccesible = () => {
    setResults(data => ({
      ...data,
      isSearching: true
    }));

    setFilters(data => ({
      ...data,
      adaAccessible: !data.adaAccessible
    }));
  }

  const handleFilterHILSC = () => {
    setResults(data => ({
      ...data,
      isSearching: true
    }));

    setFilters(data => ({
      ...data,
      HILSCVerified: data.HILSCVerified || data.HILSCVerified === false ? !data.HILSCVerified : false
    }));
  }

  const handleProgramSelect = (program) => {
    setGoProgram({go: true, slug: program.slug, agency: program.agency});
  }

  const showSelectedOptions = (selectedOptions, optionToRemove) => {
    let index = selectedOptions.indexOf(optionToRemove);
    if (index >= 0) {
      selectedOptions.splice(index, 1);
    }

    return selectedOptions;
  }

  const handleClearFilters = () => {
    setNewSearch('');
    setZipCode('');
    setShowMorefilters(false);
    setFilters(data => ({
      ...data,
      search: '',
      serviceType: [],
      immigrationStatus: null,
      zipCode: null,
      radius: null,
      incomeEligibility: null,
      immigrantAccProfile: null,
      walkInHours: false,
      programLanguages: [],
      adaAccessible: false,
    }));
    setResults(data => ({
      ...data,
      isSearching: true
    }));
  }

  if(goProgram.go){
    const url = `/program/${goProgram.agency}/${goProgram.slug}`;
    return <Redirect push to={url} />
  }

  const hilscVerifiedFilter = () => {
    const filterActive = filters && filters.HILSCVerified !== 'undefined' ? filters.HILSCVerified : null;
    const resultEmergencyMode = results && results.emergencyMode === true ? false : true;
    const active = filterActive || filterActive === false ? filters.HILSCVerified : resultEmergencyMode;
    return (
      <FormControl className={classes.formControl}>
        <Button
          className={active ? clsx(classes.searchButtonActive, classes.hilscButton) : clsx(classes.searchButton, classes.hilscButton)}
          onClick={handleFilterHILSC}>
          HILSC verified
        </Button>
      </FormControl>
    );
  }

  const serviceTypeFilter = () => {
    return (
      <FormControl className={clsx(classes.formControl, classes.serviceTypeFilter)}>
        <Select
          multiple
          value={filters.serviceType && filters.serviceType.length ? showSelectedOptions(filters.serviceType, 'Service type') : ['Service type']}
          onChange={handleChange}
          classes={{
            icon: classes.selectIcon,
          }}
          input={<BootstrapInput name="serviceType" id="service-type-customized-select" />}
          renderValue={selected => {
              return selected.map(service => {
                const programService = PROGRAM_SERVICES.find(ps => ps.value === service);
                return programService ? programService.label : service;
              }).join(', ');
          }}
        >
          <MenuItem value="" disabled>
            Service type
          </MenuItem>
          {PROGRAM_SERVICES.map(service => (
            <MenuItem key={service.value} value={service.value}>
              <Checkbox checked={filters.serviceType ? filters.serviceType.indexOf(service.value) > -1 : false} />
              <ListItemText primary={service.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const immigrationStatusFilter = () => {
    return (
      <FormControl className={clsx(classes.formControl, classes.immigrationFilter)}>
        <Select
          value={filters.immigrationStatus ? filters.immigrationStatus : 'immigration'}
          onChange={handleChange}
          classes={{
            icon: classes.selectIcon
          }}
          input={<BootstrapInput name="immigrationStatus" id="immigration-status-customized-select" />}
        >
          <MenuItem value="immigration">
            Immigration status
          </MenuItem>
          <MenuItem value={"citizen"}>U.S. Citizen</MenuItem>
          <MenuItem value={"other"}>Other</MenuItem>
        </Select>
      </FormControl>
    );
  }

  const showHideMoreFilters = () => {
    return (
      <FormControl className={classes.formControl}>
        <Button
          className={showMoreFilters ? classes.searchButtonActive : clsx(classes.searchButton, classes.filtersButton)}
          onClick={handleShowMoreFilters}>
          <TuneIcon classes={{
            root: showMoreFilters ? classes.iconInButtonActive : classes.iconInButton
          }} /> Filters
        </Button>
      </FormControl>
    );
  }

  const clearFilters = () => {
    return (
      <FormControl className={classes.formControl}>
        <Button
          className={classes.searchButton}
          onClick={handleClearFilters}>
          <ClearIcon classes={{
            root: classes.iconInButton
          }} /> Clear
        </Button>
      </FormControl>
    );
  }

  const keywordFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <div className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{
              'name': 'search',
              'aria-label': 'search',
              'onKeyPress': handleKeyPress,
              'onChange': handleChange,
              'value': newSearch ? newSearch : ''
            }}
          />
          <IconButton className={classes.iconButton} aria-label="search" onClick={handleKeywordSearch}>
            <SearchIcon />
          </IconButton>
        </div>
      </FormControl>
    );
  }

  const zipCodeFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <div className={clsx(classes.zipCode, classes.inputContainer)}>
          <InputBase
            className={classes.input}
            placeholder="Zip code"
            inputProps={{
              'aria-label': 'search',
              'name': 'zipCode',
              'onChange': handleChange,
              'onKeyPress': handleKeyPress,
              'value': zipCode ? zipCode : '',
            }}
          />
          <IconButton className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>
      </FormControl>
    );
  }

  const radiusFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          value={filters.radius ? filters.radius : 0}
          onChange={handleChange}
          classes={{
            icon: classes.selectIcon,
          }}
          input={<BootstrapInput name="radius" id="service-type-customized-select" />}
        >
          <MenuItem value={0}>
            Radius
          </MenuItem>
          <MenuItem value={5}>5 Miles</MenuItem>
          <MenuItem value={10}>10 Miles</MenuItem>
          <MenuItem value={25}>25 Miles</MenuItem>
          <MenuItem value={50}>50 Miles</MenuItem>
          <MenuItem value={100}>100 Miles</MenuItem>
        </Select>
      </FormControl>
    );
  }

  const incomeFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          value={filters.incomeEligibility ? filters.incomeEligibility : 'income'}
          onChange={handleChange}
          classes={{
            icon: classes.selectIcon
          }}
          input={<BootstrapInput name="incomeEligibility" id="income-customized-select" />}
        >
          <MenuItem value="income">
            Annual median income
          </MenuItem>
          <MenuItem value={80}>{`< 80%`}</MenuItem>
          <MenuItem value={110}>{`< 110%`}</MenuItem>
          <MenuItem value={140}>{`< 140%`}</MenuItem>
        </Select>
      </FormControl>
    );
  }

  const accessibleProfileFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          value={filters.immigrantAccProfile ? filters.immigrantAccProfile : 'profile'}
          onChange={handleChange}
          classes={{
            icon: classes.selectIcon
          }}
          input={<BootstrapInput name="immigrantAccProfile" id="profile-customized-select" />}
        >
          <MenuItem value="profile">
            Immigrant accessibility profile
          </MenuItem>
          <MenuItem value={'0'}>All (Complete/Incomplete)</MenuItem>
          <MenuItem value={'1'}>Complete</MenuItem>
        </Select>
      </FormControl>
    );
  }

  const walkInHoursFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <Button
          className={filters.walkInHours ? clsx(classes.walkInButton, classes.searchButtonActive) : clsx(classes.walkInButton, classes.searchButton)}
          onClick={handleWalkInHours}>
            Walk in hours available
        </Button>
      </FormControl>
    );
  }

  const programLanguageFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          multiple
          value={filters.programLanguages && filters.programLanguages.length ? showSelectedOptions(filters.programLanguages, 'Program languages') : ['Program languages']}
          onChange={handleChange}
          classes={{
            icon: classes.selectIcon,
          }}
          input={<BootstrapInput name="programLanguages" id="service-type-customized-select" />}
          renderValue={selected => {
          return selected.map(service => {
            const language = LANGUAGES.find(ps => ps.value === service);
            return language ? language.label : service;
          }).join(', ');
      }}
        >
          <MenuItem value="" disabled>
            Program languages
          </MenuItem>
          {LANGUAGES.map(language => (
            <MenuItem key={language.value} value={language.value}>
              <Checkbox checked={filters.programLanguages ? filters.programLanguages.indexOf(language.value) > -1 : false} />
              <ListItemText primary={language.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const adaAccessibleFilter = () => {
    return (
      <FormControl className={classes.formControl}>
        <ButtonGroup fullWidth={true}>
          <Button
            className={filters.adaAccessible ? clsx(classes.adaButton, classes.searchButtonActive) : clsx(classes.adaButton, classes.searchButton)}
            onClick={handleADAAccesible}>
            ADA accesible
          </Button>
          <Button
            className={filters.adaAccessible ? classes.searchButtonActive : classes.searchButton}
            target="_blank"
            href="https://www.access-board.gov/guidelines-and-standards/buildings-and-sites/about-the-ada-standards/guide-to-the-ada-standards">
            <HelpIcon />
          </Button>
        </ButtonGroup>
    </FormControl>
    );
  }

  return (
    <React.Fragment>
      <Container classes={{
        root: classes.filtersContainer
      }}>
        <div className={classes.filters}>
          <BrowserView>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={2}>
                {keywordFilter()}
              </Grid>
              <Grid item xs={6} sm={6} md={2}>
                {hilscVerifiedFilter()}
              </Grid>
              <Grid item xs={6} sm={6} md={2}>
                {serviceTypeFilter()}
              </Grid>
              <Grid item xs={6} sm={6} md={2}>
                {immigrationStatusFilter()}
              </Grid>
              <Grid item xs={6} sm={6} md={2}>
                {showHideMoreFilters()}
              </Grid>
              <Grid item xs={6} sm={6} md={2}>
                {clearFilters()}
              </Grid>
            </Grid>
          </BrowserView>
          <MobileView>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                {keywordFilter()}
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <div className={classes.tableContainer}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" classes={{
                          root: classes.tableCellContainer
                        }}>{hilscVerifiedFilter()}</TableCell>
                        <TableCell align="center" classes={{
                          root: classes.tableCellContainer
                        }}>{serviceTypeFilter()}</TableCell>
                        <TableCell align="center" classes={{
                          root: classes.tableCellContainer
                        }}>{immigrationStatusFilter()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                {showHideMoreFilters()}
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                {clearFilters()}
              </Grid>
            </Grid>
          </MobileView>
          {
            showMoreFilters ? (
              <React.Fragment>
                <BrowserView>
                  <Grow in={showMoreFilters}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} md={3}>
                        {zipCodeFilter()}
                      </Grid>
                      <Grid item xs={6} sm={6} md={3}>
                        {radiusFilter()}
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
                        {incomeFilter()}
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
                        {accessibleProfileFilter()}
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
                        {walkInHoursFilter()}
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
                        {programLanguageFilter()}
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        {adaAccessibleFilter()}
                      </Grid>
                    </Grid>
                  </Grow>
                </BrowserView>
                <MobileView>
                  <Grow in={showMoreFilters}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={12}>
                        <div className={classes.tableContainer}>
                          <Table aria-label="simple table">
                            <TableBody>
                              <TableRow>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{zipCodeFilter()}</TableCell>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{radiusFilter()}</TableCell>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{incomeFilter()}</TableCell>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{accessibleProfileFilter()}</TableCell>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{walkInHoursFilter()}</TableCell>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{programLanguageFilter()}</TableCell>
                                <TableCell align="center" classes={{
                                  root: classes.tableCellContainer
                                }}>{adaAccessibleFilter()}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </Grid>
                    </Grid>
                  </Grow>
                </MobileView>
              </React.Fragment>
            ) : null
          }
        </div>
      </Container>
      <Container classes={{
        root: classes.resultsCountContainer
      }}>
      {
        <span>{results && results.totalRecords ? `${results.totalRecords} results` : `0 results`}</span>
      }
      </Container>
      <Container>
        <div className={classes.resultsContainer}>
          {
            <React.Fragment>
                {
                  results.isSearching ? (
                    <div className={classes.loading}>
                      <CircularProgress className={classes.progress} color="primary" />
                    </div>
                  ) : results.agencies && results.agencies.length ? (
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={loadMoreData}
                      hasMore={results.hasNext}
                      loader={<div className={classes.loading}>
                          <CircularProgress className={classes.progress} color="primary" />
                        </div>}>
                      <ResultItem data={results.agencies} handleOnClickProgram={handleProgramSelect} />
                    </InfiniteScroll>
                  ) : (
                    <div className={classes.messages}>
                      <Alert
                        variant={'info'}
                        message={'Sorry, No results'}
                      />
                    </div>
                  )
                }
            </React.Fragment>
          }
        </div>
      </Container>
    </React.Fragment>
  );
}
