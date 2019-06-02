import React from 'react';

const FirebaseContext = React.createContext(null);

export const withFirebase = Components => props => (
    <FirebaseContext.Consumer>
        {firebase => <Components {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
)

export default FirebaseContext;