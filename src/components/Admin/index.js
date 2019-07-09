import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { withAuthorization, withEmailVerification } from '../Session';
import { UserList, UserItem } from '../Users';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const classes = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: 'red',
  },
  center: {
    textAlign: 'center',
  },
}));

const AdminPage = () => (
  <Container component="main" maxWidth="xs">
    <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" style={{textAlign: 'center'}}>
            Admin
        </Typography>
        <p>The Admin Page is accessible by every signed in admin user.</p>

        <Switch>
            <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem}/>
            <Route exact path={ROUTES.ADMIN} component={UserList} />
        </Switch>
      </div>
    </Container>
);
        		   
const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage);

