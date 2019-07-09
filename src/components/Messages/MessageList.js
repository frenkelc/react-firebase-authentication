import React from 'react';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';

import MessageItem from './MessageItem';		  

const MessageList = ({ 
    messages,
    onEditMessage,
    onRemoveMessage,
   }) => (
    <List>
        {messages.map(message => (
            <MessageItem
             key={message.uid}
             message={message} 
             onEditMessage={onEditMessage}
             onRemoveMessage={onRemoveMessage}
            />
        ))}
    </List>
);


export default MessageList;