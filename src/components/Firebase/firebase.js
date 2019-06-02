import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyBFDcSHSS-LXwnyh9ki01ByWn5qxq8TAZU",
    authDomain: "organize-56b4e.firebaseapp.com",
    databaseURL: "https://organize-56b4e.firebaseio.com",
    projectId: "organize-56b4e",
    storageBucket: "organize-56b4e.appspot.com",
    messagingSenderId: "1074232551025",
  };

  class Firebase{
    constructor(){
          app.initializeApp(config);

          this.auth = app.auth();
          this.db = app.database();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);    

    doSignOut = () => this.auth.signOut();
    
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.updatePassword(password);      

    // *** User API ***

    user =  uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');
  }

   

  export default Firebase;
