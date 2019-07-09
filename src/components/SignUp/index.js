import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
//import { classes } from '../../style/classes';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

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

const SignUpPage = () => (
    <div>
        <SignUpForm />  
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign-in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase  extends Component {
    constructor(props){
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {
        const {username, email, passwordOne, isAdmin } = this.state;
        const roles = [];

        if (isAdmin ) {
            roles.push(ROLES.ADMIN);
        }				

        this.props.firebase
           .doCreateUserWithEmailAndPassword(email, passwordOne)
           .then(authUser => {
            // Create a user in your Firebase realtime database
              return this.props.firebase.user(authUser.user.uid).set({
                    username,
                    email,
                    roles,
                });
           })
           .then(() => {
               return this.props.firebase.doSendEmailVerification();
           })
           .then(() => {
               this.setState({...INITIAL_STATE});
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

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    onChangeCheckbox = event => {
        this.setState({[event.target.name]: event.target.checked});
    };

    render(){
       const {
           username,
           email,
           passwordOne,
           passwordTwo,
           isAdmin,
           error,
       } = this.state;

       const isInvalid =
         passwordOne !== passwordTwo ||
         passwordOne === '' ||
         email === '' ||
         username === '';

       return(
         <Container component="main" maxWidth="xs">
          <CssBaseline />
           <div className={classes.paper}>
             <Avatar className={classes.avatar}>
               <LockOutlinedIcon />
             </Avatar>
             <Typography component="h1" variant="h5" style={{textAlign: 'center'}}>
               Sign up
             </Typography>
             <form onSubmit={this.onSubmit} className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} > 
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="username"
                      value={username}
                      onChange={this.onChange}
                      label="Full Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}> 
                    <TextField
                      variant="outlined"
                      required
                      fullWidth                                                       
                      name="email"
                      value={email}
                      onChange={this.onChange}
                      label="Email Address"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}> 
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="passwordOne"
                      value={passwordOne}
                      onChange={this.onChange}
                      type="password"
                      placeholder="Password"
                    />
                  </Grid>
                  <Grid item xs={12}> 
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="passwordTwo"
                      value={passwordTwo}
                      onChange={this.onChange}
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </Grid>
                  <Grid item xs={12}> 
                    <FormControlLabel
                      control={<Checkbox
                                name="isAdmin"
                                value="remember"
                                checked={isAdmin}
                                onChange={this.onChangeCheckbox}
                                color="primary" />}
                      label="Admin"
                    />
                  </Grid>
                </Grid>
                <Button
                  disabled={isInvalid}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                {error && <p style={{color: 'red'}}>{error.message}</p>}
            </form>
           </div>
         </Container>
       );
    }
}

const SignUpLink = () => (
    <p>
      <Link 
        href={ROUTES.SIGN_UP}
        variant="body2"
      >
        {"Don't have an account? Sign Up"}
      </Link>
    </p>
);
const SignUpForm = withRouter(withFirebase(SignUpFormBase));
export default SignUpPage;
export { SignUpForm, SignUpLink };