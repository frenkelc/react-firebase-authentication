import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { withFirebase } from '../Firebase';
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

class UserList extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
        };
}        

componentDidMount() {			
    if (!this.props.users.length) {
      this.setState({ loading: true });
    }

    this.props.firebase.users().on('value', snapshot => {
      this.props.onSetUsers(snapshot.val());

      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users } = this.props;
    const { loading } = this.state;							  

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
             <Typography component="h2" variant="h5" style={{textAlign: 'center'}}>
               Users
             </Typography>
             {loading && <div>Loading ...</div>}
             <ul>
              {users.map(user => (
                <li key={user.uid}>
                  <span>
                    <strong>ID:</strong> {user.uid}
                  </span>
                  <span>
                    <strong>E-Mail:</strong> {user.email}
                  </span>
                  <span>
                    <strong>Username:</strong> {user.username}
                  </span>
                  <span>
                    <Link to={`${ROUTES.ADMIN}/${user.uid}`}>
                      Details
                    </Link>
                  </span>
                </li>
              ))}
             </ul>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  users: Object.keys(state.userState.users || {}).map(key => ({
    ...state.userState.users[key],
    uid: key,
  })),
});
  
const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users}),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserList);