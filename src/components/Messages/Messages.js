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
import MessageList from './MessageList';

class Messages extends Component {
    constructor(props){
        super(props);

        this.state = {
            text: '',
            loading : false,
        };
    }

    componentDidMount() {
        if (!this.props.messages.length) {
            this.setState({ loading: true });
          }

        this.onListenForMessages();
    }
    
    componentDidUpdate(props) {
        if (props.limit !== this.props.limit) {
            this.onListenForMessages();
        }
    }
    
    onListenForMessages = () => {
        this.props.firebase
          .messages()
          .orderByChild('createdAt')
          .limitToLast(this.props.limit)
          .on('value', snapshot => {
           this.props.onSetMessages(snapshot.val());
          
           this.setState({ loading: false });
        });
    }

    componentWillUnmount() {
        this.props.firebase.messages().off();
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    };

    onCreateMessage  = (event, authUser) => {
        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });

        this.setState({ text : '' });

        event.preventDefault();
    };

    onEditMessage = (message, text) => {
        this.props.firebase.message(message.uid).set({
            ...message,
            text,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
     };
     
    onNextPage = () => {
     this.props.onSetMessagesLimit(this.props.limit + 5);
    };

    render() {
        const { users, messages } = this.props;
        const { text, loading } = this.state;

        return (
             <div>
                {!loading && messages &&  (
                    <Button variant="contained" color="primary" type="button" onClick={this.onNextPage}>
                        More
                    </Button>
                )}

                {loading && <div>Loading ...</div>}
       
                {messages && (
                    <MessageList
                      messages={messages.map(message => ({
                          ...message,
                          user: users
                            ? users[message.userId]
                            : { userId: message.userId},
                      }))} 
                      onEditMessage={this.onEditMessage}
                      onRemoveMessage ={this.onRemoveMessage}
                    />
                )}

                {!messages && <div>There are no messages ...</div>}

                <form
                  onSubmit={event =>
                   this.onCreateMessage(event, this.props.authUser)
                  }
                >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type="text"
                      value={text}
                      onChange={this.onChangeText}
                    />
                    <Button variant="contained" color="primary" type="submit">Send</Button>
                </form>
             </div>
        );
    }
}

const mapStateToProps = state => ({						 
    authUser: state.sessionState.authUser,
    messages: Object.keys(state.messageState.messages || {}).map(
        key => ({
            ...state.messageState.messages[key],
            uid: key,
        }),
    ),
    limit: state.messageState.limit,
});

const mapDispatchToProps = dispatch => ({
    onSetMessages: messages =>
      dispatch({ type: 'MESSAGES_SET', messages }),
    onSetMessagesLimit : limit =>
      dispatch({ type : 'MESSAGES_LIMIT_SET', limit }) ,
});

export default compose(
    withFirebase,
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ),
  )(Messages);
    