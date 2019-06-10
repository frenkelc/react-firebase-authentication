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

  class Firebase {
    constructor(){
          app.initializeApp(config);

          this.emailAuthProvider = app.auth.EmailAuthProvider;
          this.auth = app.auth();
          this.db = app.database();

          this.googleProvider = new app.auth.GoogleAuthProvider();
          this.facebookProvider = new app.auth.FacebookAuthProvider();
          this.twitterProvider = new app.auth.TwitterAuthProvider();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);    

    doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider);

    doSignInWithFacebook = () =>
        this.auth.signInWithPopup(this.facebookProvider);

    doSignInWithTwitter = () =>
        this.auth.signInWithPopup(this.twitterProvider);

    doSignOut = () => this.auth.signOut();
    
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.updatePassword(password);      
    
    doSendEmailVerification = () =>
        this.auth.currentUser.sendEmailVerification({
          url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      });
    

    // *** Merge Auth and DB User API *** //

    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

    // *** User API ***

    user =  uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');
  }

   

  export default Firebase;
