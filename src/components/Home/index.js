import React, { Component } from 'react';								   
import { connect } from 'react-redux';
import { compose } from 'recompose';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
																		   
import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';	 
import Messages from '../Messages';

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

class HomePage extends Component {
    componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.props.onSetUsers(snapshot.val());
    });
  }
  
    componentWillUnmount() {
      this.props.firebase.users().off();
    }
  
    render() {
      const { users } = this.props;
  
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
            <div className={classes.paper}>
            <Typography component="h1" variant="h5" style={{textAlign: 'center'}}>
              Home Page
            </Typography>
            <p>The Home Page is accessible by every signed in user.</p>
            <Messages users={users} />
            </div>
        </Container>
       
      );
    }
  }

const mapStateToProps = state => ({
  users: state.userState.users,
});
  										 
const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);