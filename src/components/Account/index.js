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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

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
}));

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
  {
    id: 'twitter.com',
    provider: 'twitterProvider',
  },
];

const AccountPage = ({ authUser }) => (
    <Container component="main" maxWidth="xs">
       <CssBaseline />
       <div className={classes.paper}>
         <Typography component="h1" variant="h5" style={{textAlign: 'center'}} >
            <p>Account: {authUser.email}</p>
         </Typography>
         <Grid container spacing={2}>
            <Grid item>
              <PasswordForgetForm />
            </Grid>
            <Grid item>
              <PasswordChangeForm />
            </Grid>
            </Grid>
         <LoginManagement authUser={authUser} />
      </div>
    </Container>
);

class LoginManagementBase extends Component {
  constructor(props){
    super(props);

    this.state = {
     activeSignInMethods: [],
     error: null
    };
  }
  
  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
    .fetchSignInMethodsForEmail(this.props.authUser.email)
    .then(activeSignInMethods => 
      this.setState({ activeSignInMethods, error : null}),
    )
      .catch(error => this.setState({ error }));
  };

  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
    .linkWithPopup(this.props.firebase[provider])
    .then(this.fetchSignInMethods)
    .catch(error => this.setState({ error }));
  };
  
 onDefaultLoginLink = password => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password,
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onUnlink = providerId => {
    this.props.firebase.auth.currentUser
    .unlink(providerId)
    .then(this.fetchSignInMethods)
    .catch(error => this.setState({ error }));
  };

 render() {
    const { activeSignInMethods, error } = this.state;

    return(
        <div>
          Sign In Methods:
          <List >
            {SIGN_IN_METHODS.map(signInMethod => {
              const onlyOneLeft = activeSignInMethods.length === 1;
              const isEnabled = activeSignInMethods.includes(
                signInMethod.id,
              );

              return(
                <ListItem  key={signInMethod.id}>
                {signInMethod.id === 'password' ? (
                    <DefaultLoginToggle
                      onlyOneLeft={onlyOneLeft}
                      isEnabled={isEnabled}
                      signInMethod={signInMethod}
                      onLink={this.onDefaultLoginLink}
                      onUnlink={this.onUnlink}
                    />
                  ) : (
                    <SocialLoginToggle
                      onlyOneLeft={onlyOneLeft}
                      isEnabled={isEnabled}
                      signInMethod={signInMethod}
                      onLink={this.onSocialLoginLink}
                      onUnlink={this.onUnlink}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
          {error && <p style={{color: 'red'}}>{error.message}</p>}
        </div>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <Button
      variant="contained" 
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Button 
      variant="contained" 
      type="button" 
      onClick={() => onLink(signInMethod.provider)}
    >
      Link {signInMethod.id}
   </Button>
  );

class DefaultLoginToggle extends Component {  
  constructor(props){
    super(props);

    this.state = {passwordOne: '', passwordTwo: '' };
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: '' , passwordTwo: '' });
  };

  onChange = event => {
    this.setState({[ event.target.name]: event.target.value });
  };

  render() {
    const {
      onlyOneLeft,
      isEnabled,
      signInMethod,
      onUnlink,
    } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

      return isEnabled ? (
        <Button
          variant="contained" 
          type="button"
          onClick={() => onUnlink(signInMethod.id)}
          disabled={onlyOneLeft}
        >
          Deactivate {signInMethod.id}
        </Button>
        ) : (
          <form onSubmit={this.onSubmit} className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="New Password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm New Password"
          />

            <Button variant="contained" disabled={isInvalid} type="submit">
              Link {signInMethod.id}
            </Button>
          </form>
      );
  }
}					  

const LoginManagement = withFirebase(LoginManagementBase);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

const condition = authUser => !!authUser;

export default compose(
  connect(mapStateToProps),
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);