import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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

class MessageItem extends Component {
    constructor(props){
        super(props);

        this.state = {
            editMode: false,
            editText: this.props.message.text,
        };
    }

    onToggleEditMode = () => {
        this.setState(state => ({
            editMode: !state.editMode,
            editText: this.props.message.text,
        }));
    };

    onChangeEditText  = event => {
        this.setState({ editText: event.target.value });
    };

    onSaveEditText = () => {
        this.props.onEditMessage(this.props.message, this.state.editText);

        this.setState({ editMode: false });
    };

    render() {
        const { message, onRemoveMessage } = this.props;
        const { editMode, editText } = this.state;

        return (
           <ListItemText>
            {editMode ? (
              <TextField
                 variant="outlined"
                 margin="normal"
                 fullWidth
                 type="text"
                 value={editText}
                 onChange={this.onChangeEditText}
              />
            ) : (
               <span>
               <strong>
                {message.user.username || message.user.userId}
               </strong><br/>
               {message.text} {message.editedAt && <span>(Edited)</span>}<br/>
              </span> 
            )}
                
           {editMode ? (
              <span>
                  <Button variant="contained" onClick={this.onSaveEditText}>Save</Button>
                  <Button variant="contained" onClick={this.onToggleEditMode}>Reset</Button>
              </span>
            ) : (
                <Button variant="contained" onClick={this.onToggleEditMode}>Edit</Button>
            )}

            {!editMode && (
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => onRemoveMessage(message.uid)}
                >
                  Delete
                </Button>
            )}
          </ListItemText>
        );
    }
}

export default MessageItem;