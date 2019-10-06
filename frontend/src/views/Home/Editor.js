import React, {
  useState,
  useEffect
} from 'react';
import { Redirect } from 'react-router-dom';

// Custom hooks
import useDebounce from 'customhooks/useDebounce';

// API
import {
  getAgencies,
} from 'api';

// Material UI components
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

// Custom components
import Autocomplete from 'components/Autocomplete/Autocomplete';
import Label from 'components/Label/Label';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './EditorStyles';
const useStyles = makeStyles(styles);

const AgencyRow = ({ agency, handleSelect }) => {
  const classes = useStyles();

  const handleOnClick = () => {
    handleSelect(agency);
  }

  return (
    <TableRow onClick={handleOnClick} className={classes.row}>
      <TableCell component="td" scope="row" >
        <Label text={agency.label} variant="body1" />
      </TableCell>
    </TableRow>
  )
}

export default () => {
  const classes = useStyles();

  const [searchAgencyTerm, setsearchAgencyTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencyResults, setAgencyResults] = useState({
    agencies: [],
  });
  const [newSearch, setNewSearch] = useState({
    page: 2,
    searchTerm: null,
  });

  const [newAgency, setNewAgency] = useState(false);
  const [newProgram, setNewProgram] = useState(false);

  const debouncedsearchAgencyTerm = useDebounce(searchAgencyTerm, 1000);

  // Get agencies based on search
  useEffect(() => {
    if (debouncedsearchAgencyTerm) {
      setIsSearching(true);
      getAgencies({
          property: 'name',
          value: searchAgencyTerm,
          page: 1
      }).then(results => {
        setIsSearching(false);
        setAgencyResults({
          hasNext: results.data.has_next,
          hasPrev: results.data.has_prev,
          page: results.data.page,
          totalPages: results.data.total_pages,
          totalRecords: results.data.total_records,
          agencies: results.data.results.map(agency => ({
            value: agency.fields.slug,
            label: agency.fields.name
          }))
        });
      });
    }
  }, [debouncedsearchAgencyTerm, searchAgencyTerm]);


  // Get more agencies paged based on search
  useEffect(() => {
    if(newSearch.searchTerm) {
      setIsSearching(true);
      getAgencies({
          property: 'name',
          value: newSearch.searchTerm,
          page: newSearch.page
      }).then(results => {
        setIsSearching(false);
        setAgencyResults({
          hasNext: results.data.has_next,
          hasPrev: results.data.has_prev,
          page: results.data.page,
          totalPages: results.data.total_pages,
          totalRecords: results.data.total_records,
          agencies: results.data.results.map(agency => ({
            value: agency.fields.slug,
            label: agency.fields.name
          }))
        });
      });
    }
  }, [newSearch])

  const handleSelect = (agencySelected) => {
    setSelectedAgency(agencySelected);
  };

  const handleSearch = (searchText) => {
    searchText = searchText === "" ? searchText = searchAgencyTerm : searchText;
    setsearchAgencyTerm(searchText);
  }

  const handleShowMoreAgencies = () => {
    setNewSearch(data => ({...data, page: data.page, searchTerm: searchAgencyTerm}));
  }

  const handleChangePage = (event, page) => {
    setNewSearch(data => ({...data, page: page + 1, searchTerm: searchAgencyTerm}));
  }

  const handleNewAgency = () =>{
    setNewAgency(true);
  }

  const handleNewProgram = () =>{
    setNewProgram(true);
  }

  if(newAgency){
    return <Redirect push to={'/agency/create'} />
  }

  if(newProgram){
    return <Redirect push to={'/program/create'} />
  }

  if(selectedAgency) {
    const url = `/agency/${selectedAgency.value}`;
    return <Redirect push to={url} />
  }

  return (
    <Container>
      <Paper className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5">
              Add new...
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} className={classes.centered}>
            <Button
              variant="outlined"
              className={classes.greenOutlinedButton}
              onClick={handleNewAgency}
            >
              Agency
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6} className={classes.centered}>
            <Button
              variant="outlined"
              className={classes.greenOutlinedButton}
              onClick={handleNewProgram}
            >
              Program
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" className={classes.centered}>
              - OR -
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.search}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5">
              Edit Agency and its programs { isSearching ? (<CircularProgress color="primary" size={24} />) : null}
            </Typography>
            {
              agencyResults.hasNext ? (
                <React.Fragment>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleShowMoreAgencies}
                  >
                    {`Don't see what you're looking for? Click here to see all agencies containing "${searchAgencyTerm}"?`}
                  </Link>
                </React.Fragment>
                
              ) : null 
            }
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Autocomplete
              placeholder={"Enter agency name here"}
              suggestions={agencyResults.agencies}
              handleSelect={handleSelect}
              handleChange={handleSearch}
            />
          </Grid>
        </Grid>
        {
          newSearch.searchTerm ? (
            <Grid container spacing={3} justify="flex-end">
              <Table>
                <TableBody>
                  {
                    agencyResults.agencies.map((agency, idx) => (
                      <AgencyRow key={idx} agency={agency} handleSelect={handleSelect} />
                    ))
                  }
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10]}
                count={agencyResults && agencyResults.totalRecords ? agencyResults.totalRecords : 0}
                component="div"
                page={agencyResults && agencyResults.page ? agencyResults.page - 1 : 0}
                rowsPerPage={10}
                backIconButtonProps={{
                  'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page',
                }}
                onChangePage={handleChangePage}
              />
            </Grid>
          ) : null
        }
      </Paper>
    </Container>
  );
}
