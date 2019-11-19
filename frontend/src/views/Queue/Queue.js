import React, {
  useState,
  useEffect,
} from 'react';

import { NavLink } from "react-router-dom";

import {
  useSelector,
} from 'react-redux';

// API
import {
  getQueue
} from 'api';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './QueueStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({queue: []});
  
  const token = useSelector(state => state.user.accessToken);

  useEffect(() => {
    getQueue(token, filters).then(resultSet => {
      setData(data => ({
        ...data,
        queue: resultSet.data.results,
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <h2 className={classes.title}>Queue</h2>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Requestor Email</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.queue.map(queue => (
              <TableRow key={queue.id} classes={{
                "root": queue.emergency_mode ? classes.emergencyMode : null,
              }}>
                <TableCell align="left">{queue.name}</TableCell>
                <TableCell align="center">{queue.action}</TableCell>
                <TableCell align="center">{queue.model}</TableCell>
                <TableCell align="center">{queue.requestor_email}</TableCell>
                <TableCell align="center">
                  <NavLink
                    to={queue.model === 'Agency' ? `/private/queue/agency/${queue.id}` : `/private/queue/program/${queue.id}`}
                    className={classes.customLink}
                  >
                    View
                  </NavLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10]}
          count={data.queue && data.totalRecords ? data.totalRecords : 0}
          component="div"
          page={data.queue && data.page ? data.page - 1 : 0}
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
    </Grid>
  );
}
