import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import { classes } from '../../style/classes';
import * as ROUTES from '../../constants/routes';



const SignInPage = () => (
      <div>
          <SignInForm />
      </div>
  );

  

  const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
  };

  const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

  class SignInFormBase  extends Component {
      constructor(props){
          super(props);

          this.state = { ...INITIAL_STATE };
      }

      onSubmit = event => {
          const { email, password } = this.state;

          this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
			.catch(error => {
             this.setState({ error });
            });	  

        event.preventDefault();  
      };

      onChange = event => {
          this.setState({ [event.target.name]: event.target.value});
      };

      
      render(){
          const { email, password, error } = this.state;

          const isInvalid = password === '' || email === '';
          //const classes = useStyles();

          return(
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                   <Avatar className={classes.avatar}>
                     <LockOutlinedIcon/>
                   </Avatar>
                   <Typography component="h1" variant="h5" style={{textAlign: 'center'}}>
                     Sign in
                   </Typography>
                   <form onSubmit={this.onSubmit} className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email Address"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        autoFocus
                        autoComplete="email"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                    />
                    <Button 
                        disabled={isInvalid} 
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                      Sign In
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <PasswordForgetLink />
                      </Grid>
                      <Grid item>
                        <SignUpLink />
                      </Grid>
                    </Grid>
                    {error && <p style={{color: 'red'}}>{error.message}</p>}
                 </form>
                 <SignInGoogle style={{textAlign: 'center'}}/>
                 <SignInFacebook style={{textAlign: 'center'}}/>
                 <SignInTwitter style={{textAlign: 'center'}}/>
                </div>
              </Container>
          );
      }
      
  }
class SignInGoogleBase extends Component {
    constructor(props){
        super(props);

        this.state = { error:null };
    }

    onSubmit = event => {
        this.props.firebase
        .doSignInWithGoogle()
        .then(socialAuthUser => {
         // Create a user in your Firebase Realtime Database too
          return this.props.firebase.user(socialAuthUser.user.uid).set({
              username: socialAuthUser.user.displayName,
              email: socialAuthUser.user.email,
              roles: [],
          });
        })
        .then(() =>{
            this.setState({ error: null});
            this.props.history.push(ROUTES.HOME);
        })
        .catch(error => {
            if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                error.message = ERROR_MSG_ACCOUNT_EXISTS;
            }

            this.setState({ error });
        });				 

        event.preventDefault();
    }  ;

    render(){
        const { error } =this.state;
        const classes = useStyles();
        return(
            <form onSubmit={this.onSubmit} className={classes.form}>
                <Button type="submit" fullWidth>Sign In with Google</Button>

                {error && <p style={{color: 'red'}}>{error.message}</p>}
            </form>
        );
    }
}

class SignInFacebookBase extends Component {
    constructor(props) {
      super(props);
  
      this.state = { error: null };
    }
  
    onSubmit = event => {
      this.props.firebase
        .doSignInWithFacebook()
        .then(socialAuthUser => {
            // Create a user in your Firebase Realtime Database too
            return this.props.firebase.user(socialAuthUser.user.uid).set({
                username: socialAuthUser.additionalUserInfo.profile.name,
                email: socialAuthUser.additionalUserInfo.profile.email,
                roles: [],
              });
          })
        .then(() => {
          this.setState({ error: null });
          this.props.history.push(ROUTES.HOME);
        })
        .catch(error => {
            if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                error.message = ERROR_MSG_ACCOUNT_EXISTS;
            }

          this.setState({ error });
        });
  
      event.preventDefault();
    };
  
    render() {
      const { error } = this.state;
      const classes = useStyles();

      return (
        <form onSubmit={this.onSubmit} className={classes.form}>
          <Button type="submit" fullWidth>Sign In with Facebook</Button>
  
          {error && <p style={{color: 'red'}}>{error.message}</p>}
        </form>
      );
    }
  }

  class SignInTwitterBase extends Component {
    constructor(props) {
      super(props);
  
      this.state = { error: null };
    }
  
    onSubmit = event => {
      this.props.firebase
        .doSignInWithTwitter()
        .then(socialAuthUser => {
            // Create a user in your Firebase Realtime Database too
            return this.props.firebase.user(socialAuthUser.user.uid).set({
                username: socialAuthUser.additionalUserInfo.profile.name,
                email: socialAuthUser.additionalUserInfo.profile.email,
                roles: [],
              });
          })
        .then(() => {
          this.setState({ error: null });
          this.props.history.push(ROUTES.HOME);
        })
        .catch(error => {
            if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                error.message = ERROR_MSG_ACCOUNT_EXISTS;
            }

          this.setState({ error });
        });
  
      event.preventDefault();
    };
  
    render() {
      const { error } = this.state;
      const classes = useStyles();
  
      return (
        <form onSubmit={this.onSubmit} className={classes.form}>
          <Button type="submit" fullWidth>Sign In with Twitter</Button>
  
          {error && <p style={{color: 'red'}}>{error.message}</p>}
        </form>
      );
    }
  }

  const SignInForm = compose(
      withRouter,
      withFirebase,
  )(SignInFormBase);

  const SignInGoogle = compose(
    withRouter,
    withFirebase,
  )(SignInGoogleBase);

  const SignInFacebook = compose(
    withRouter,
    withFirebase,
  )(SignInFacebookBase);

  const SignInTwitter = compose(
    withRouter,
    withFirebase,
  )(SignInTwitterBase);

  export default SignInPage;

  export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
