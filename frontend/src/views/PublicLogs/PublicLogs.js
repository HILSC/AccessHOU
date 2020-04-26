import React, {
  useState,
  useEffect,
} from 'react';
import saveAs from 'file-saver';

import {
  useSelector,
} from 'react-redux';

import MomentUtils from '@date-io/moment';

// API
import {
  getPublicLogs,
  exportPublicLogs,
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
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// Custom components
import Alert, { ALERT_VARIANTS } from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './PublicLogsStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);

  const moment = new MomentUtils({ locale: "en" });

  const [filters, setFilters] = useState({});
  const [data, setData] = useState({
    publicLogs: [],
    startDate: moment.moment().subtract(1, 'months').format('L'),
    endDate: moment.moment().format('L'),
  });
  const [showMessage, setShowMessage] = useState({show: false});

  useEffect(() => {
    getPublicLogs(token, filters).then(resultSet => {
      setData(data => ({
        ...data,
        publicLogs: resultSet.data.results,
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

  const handleChangePage = (event, page) => {
    setFilters(data => ({...data, page: page + 1}));
  }

  const handleStartDateChange = date => {
    if(date.isSameOrBefore(data.endDate)){
      const startDate = date.format('L');
      setData(data => ({
        ...data,
        startDate,
      }));
      setShowMessage({
        show: false,
      });
    }else{
      setShowMessage({
        show: true,
        msg: "Start date should be lower than end date.",
        variant: ALERT_VARIANTS.ERROR,
      });
    }
    
  }

  const handleEndDateChange = date => {
    if (date.isSameOrAfter(data.startDate)) {
      const endDate = date.format('L');
      setData(data => ({
        ...data,
        endDate,
      }));
      setShowMessage({
        show: false,
      });
    } else {
      setShowMessage({
        show: true,
        msg: "End date should be greater than start date.",
        variant: ALERT_VARIANTS.ERROR,
      });
    }
    
  }

  const handleExportCSV = () => {
    const diff = moment.moment(data.startDate).diff(data.endDate, 'years');
    if(diff < 0) {
      setShowMessage({show: true, msg: 'Please restrict your date range to a maximum of a year.', variant: ALERT_VARIANTS.ERROR})
    } else {
      setShowMessage({show: true, msg: 'Exporting changelog...', variant: ALERT_VARIANTS.INFO})
      exportPublicLogs(token, {
        startDate: data.startDate,
        endDate: data.endDate
      }).then(result => {
        saveAs(result.data, 'accesshou_changelog.csv');
        setShowMessage({show: false});
      }).catch(() => {
        setShowMessage({show: true, msg: 'Sorry, Can\'t download changelog.', variant: ALERT_VARIANTS.ERROR})
      });
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <h2 className={classes.title}>Changelog</h2>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Requestor Name</TableCell>
              <TableCell align="center">Requestor Email</TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Model</TableCell>
              <TableCell align="center">Entity Name</TableCell>
              <TableCell align="center">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.publicLogs.map(publicLog => (
              <TableRow key={`${publicLog.model}-${publicLog.id}`}>
                <TableCell align="center">{publicLog.requestor_name}</TableCell>
                <TableCell align="center">{publicLog.requestor_email}</TableCell>
                <TableCell align="center">{publicLog.action}</TableCell>
                <TableCell align="center">{publicLog.model}</TableCell>
                <TableCell align="left">{publicLog.entity_name}</TableCell>
                <TableCell align="center">{publicLog.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10]}
          count={data.publicLogs && data.totalRecords ? data.totalRecords : 0}
          component="div"
          page={data.publicLogs && data.page ? data.page - 1 : 0}
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
      <Grid item xs={12} sm={12} md={12}>
        <h2 className={classes.title}>Export Changelog</h2>
        <h3 className={classes.exportMessage}>Using this tool you can export <span className={classes.exportMessageBold}>up to a year</span> of data.</h3>
        {
          showMessage.show ? (
            <Alert
              variant={showMessage.variant}
              message={showMessage.msg}
            />
          ) : null
        }
      </Grid>
      <Grid item xs={12} sm={5} md={5} className={classes.exportContainer}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="start_date"
            label="Start Date *"
            format="MM-D-YYYY"
            value={data.startDate}
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12} sm={5} md={5} className={classes.exportContainer}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="end_date"
            label="End Date *"
            format="MM-D-YYYY"
            value={data.endDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12} sm={2} md={2} className={classes.exportContainer}>
        <Button variant="contained" color="primary"
          className={classes.exportButton}
          onClick={handleExportCSV}
          title="Export to CSV"
          >
          <GetAppIcon />
        </Button>
      </Grid>
    </Grid>
  );
}
