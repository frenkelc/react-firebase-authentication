import React, { Component } from 'react';
import { compose } from 'recompose';
																		   
import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';	 
import Messages from '../Messages';

class HomePage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        loading: false,
        users: null,
      };
    }
  
    componentDidMount() {
      this.setState({ loading: true });
      this.props.firebase.users().on('value', snapshot => {
        this.setState({
          users: snapshot.val(),
          loading: false,
        });
      });
    }
  
    componentWillUnmount() {
      this.props.firebase.users().off();
    }
  
    render() {
      const { users, loading } = this.state;
  
      return (
        <div>
          <h1>Home Page</h1>
          <p>The Home Page is accessible by every signed in user.</p>
  
          <Messages users={users} usersLoading={loading} />
        </div>
      );
    }
  }
  
const condition = authUser => !!authUser;

export default compose(	 
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
  )(HomePage);