import React, { Component } from 'react';
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
  }));

const PasswordForgetPage = () => (
    <div>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE ={
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props){
        super(props);

        this.state ={ ...INITIAL_STATE};
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
        .doPasswordReset(email)
        .then(() => {
            this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
            this.setState({ error });
        });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render(){
        const { email, error } = this.state;

        const isInvalid = email === '';

        return(
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Typography component="h1" variant="h5" style={{textAlign: 'center'}}>
                  Reset Password 
                </Typography>
                <form onSubmit={this.onSubmit} className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} > 
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth                                                       
                        name="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        label="Email Address"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} > 
                      <Button
                        disabled={isInvalid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                       Reset My Password
                      </Button>
                    </Grid>
                  </Grid>
                  {error && <p style={{color: 'red'}}>{error.message}</p>}
                </form>
              </div>
            </Container>        
        );
    }
}

const PasswordForgetLink =() =>(
   <p>
      <Link 
        href={ROUTES.PASSWORD_FORGET}
        variant="body2" 
      >
        Forget Password
      </Link>
    </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink};