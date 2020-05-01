import React, {
  useState,
  useEffect,
} from 'react';

import { NavLink } from 'react-router-dom';

import {
  useSelector,
} from 'react-redux';

// API
import {
  getAdvocacyReports,
  getAdvocacyReport,
  updateAdvocacyReport,
} from 'api';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

// Custom components
import DataLabel from 'components/DataLabel/DataLabel';
import CustomInput from "components/CustomInput/CustomInput";
import Alert from 'components/Alert/Alert';
import { ENTITY_TO_REPORT } from 'components/AdvocacyReport/AdvocacyReportForm';

import {
  ADVOCACY_REPORT_STATUSES
} from "constants.js";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AdvocacyReportsStyles';
const useStyles = makeStyles(styles);

const getReports = async (token, filters) => {
  const response = await getAdvocacyReports(token, filters);
  return response
}

const ViewTableCell = ({ report, handleAction, token }) =>{
  const handleClick = () => {
    getAdvocacyReport(token, report.id).then(result => {
      handleAction(result.data);
    });
  }

  return (
    <TableCell align="center">
      <Button size="small" variant="contained" color="primary" onClick={handleClick}>
        View
      </Button>
    </TableCell>
  )

}

export default () => {
  const classes = useStyles();
  const token = useSelector(state => state.user.accessToken);

  const [filters, setFilters] = useState({});
  const [data, setData] = useState({reports: []});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [values, setValues] = useState({});
  const [formState, setFormState ] = useState({
    messageType: null,
    message: '',
  });
  
  useEffect(() => {
    getReports(token, filters).then(resultSet => {
      setData(data => ({
        ...data,
        reports: resultSet.data.results,
        totalRecords: resultSet.data.total_records,
        totalPages: resultSet.data.total_pages,
        page: resultSet.data.page,
        hasNext: resultSet.data.has_next,
        hasPrev: resultSet.data.has_prev
      }));
    });
  }, [
    token,
    filters,
  ]);

  const handleViewClick = (report) => {
    setValues({...values, ...report});
    setFormState(() => ({
      messageType: null,
      message: ''
    }));
    setDialogOpen(true);
  }

  const handleChangePage = (event, page) => {
    setFilters(data => ({...data, page: page + 1}));
  }

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  }

  const handleSubmit = () => {
    updateAdvocacyReport(token, values).then(result => {
      setDialogOpen(false);

      setFormState(() => ({
        messageType: 'success',
        message: result.data.message
      }));

      getReports(token).then(resultSet => {
        setData(data => ({
          ...data,
          reports: resultSet.data.results,
          totalRecords: resultSet.data.total_records,
          totalPages: resultSet.data.total_pages,
          page: resultSet.data.page,
          hasNext: resultSet.data.has_next,
          hasPrev: resultSet.data.has_prev
        }));
      });
    });
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const showAlert = () => {
    return formState.messageType && formState.messageType === 'success' && <Alert message={formState.message} variant={formState.messageType} />
  }

  const showFormAlert = () => {
    return formState.messageType && formState.messageType === 'error' && <Alert message={formState.message} variant={formState.messageType} />
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <h2 className={classes.title}>Advocacy Reports</h2>
        {showAlert()}
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date Submitted</TableCell>
              <TableCell align="center">Entity</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.reports.map(report => (
              <TableRow key={`${report.id}`}>
                <TableCell align="center">{report.created_at}</TableCell>
                <TableCell align="center">{
                  report.entity_selected === ENTITY_TO_REPORT.NEW ?
                  "Agency/Program not in AccessHOU" : report.entity_selected.charAt(0).toUpperCase() + report.entity_selected.slice(1)
                  }</TableCell>
                <TableCell align="center">{report.entity.name}</TableCell>
                <TableCell align="center">{report.status}</TableCell>
                <ViewTableCell report={report} handleAction={handleViewClick} token={token} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10]}
          count={data.reports && data.totalRecords ? data.totalRecords : 0}
          component="div"
          page={data.reports && data.page ? data.page - 1 : 0}
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
      <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Advocacy Report Info
          </DialogTitle>
          <DialogContent classes={{
            root: classes.dialogContent
          }}>
            <form>
              {showFormAlert()}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <DataLabel
                    labelText={`Submitter's name`}
                    dataText={values.user ? values.user.name : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DataLabel
                    labelText={`Submitter's agency`}
                    dataText={values.user ? values.user.agency : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DataLabel
                    labelText={`Submitter's email`}
                    dataText={values.user ? values.user.email : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DataLabel
                    labelText={`Submitter's phone`}
                    dataText={values.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <DataLabel
                    labelText={values.entity_selected === ENTITY_TO_REPORT.NEW ? "Agency/Program not in AccessHOU" : 
                    values.entity_selected ? values.entity_selected[0].toUpperCase() + values.entity_selected.slice(1) : ''}
                    dataText={values.entity && values.entity.slug && !values.entity.agency ? (
                      <NavLink to={`/${values.entity_selected.toLowerCase()}/${values.entity.slug}`} target="_blank">
                        {values.entity ? values.entity.name : ''}
                      </NavLink>
                    ) : values.entity && values.entity.agency && values.entity.slug ? (
                      <NavLink to={`/${values.entity_selected.toLowerCase()}/${values.entity.agency}/${values.entity.slug}`} target="_blank">
                        {values.entity ? values.entity.name : ''}
                      </NavLink>
                    ) : <span>{values.entity ? values.entity.name : ''}</span> }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DataLabel
                    labelText={`Time of incident`}
                    dataText={values.issue_time}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DataLabel
                    labelText={`Date of incident`}
                    dataText={values.issue_date}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <DataLabel
                    labelText={`Issue description`}
                    dataText={values.issue}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <DataLabel
                    labelText={`Recommended alternative to issue`}
                    dataText={values.recommendation}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <CustomInput
                    id="notes"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      label: "Notes",
                      onChange: handleChange,
                      name: "notes",
                      value: values.notes ? values.notes : '',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <CustomInput
                    type="select"
                    labelText="Status"
                    id="status"
                    options={ADVOCACY_REPORT_STATUSES}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: handleChange,
                      name: "status",
                      value: values.status ? values.status : '',
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDialogClose} color="primary">
              Close
            </Button>
            <Button variant="contained" onClick={handleSubmit} color="secondary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>        
    </Grid>
  );
}
