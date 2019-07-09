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

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
  };

  class PasswordChangeForm extends Component {
      constructor(props){
          super(props);

          this.state = { ...INITIAL_STATE };    
      }

      onSubmit = event => {
          const { passwordOne } = this.state;

          this.props.firebase
          .doPasswordUpdate(passwordOne)
          .than(() => {
              this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
              this.setState({ error });
          }) ;

          event.preventDefault();
      };

      onChange = event => {
          this.setState({ [event.target.name]: event.target.value});
      };

      render(){
          const { passwordOne, passwordTwo, error } = this.state;

          const isInvalid = 
          passwordOne !== passwordTwo || passwordOne === '';

          return(
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Typography component="h1" variant="h5" style={{textAlign: 'center'}}>
                     Change Password
                  </Typography>
                  <form onSubmit={this.onSubmit} className={classes.form}>
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="passwordOne"
                        value={this.state.passwordOne}
                        onChange={this.onChange}
                        type="password"
                        Label="New Password"
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="passwordTwo"
                        value={this.state.passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm New Password"
                        />
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

                        {error && <p style={{color: 'red'}}>{ error.message}</p>}
                  </form>
                 </div>
              </Container>
          );
      }
  }

  export default withFirebase(PasswordChangeForm);