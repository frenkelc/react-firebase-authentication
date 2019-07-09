import React from 'react';
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Navigation = ({ authUser }) =>
  authUser ? (
    <NavigationAuth authUser={authUser} />
  ) : (
    <NavigationNonAuth />
  );

const NavigationAuth = ({ authUser }) => (
       <ul>
          <li>
               <Link href={ROUTES.LANDING} variant="body2">Landing</Link>
          </li>
          <li>
               <Link href={ROUTES.HOME} variant="body2">Home</Link>
          </li>
          <li>
               <Link href={ROUTES.ACCOUNT} variant="body2">Account</Link>
          </li>
          {authUser.roles.includes(ROLES.ADMIN) && ( 
           <li>
               <Link href={ROUTES.ADMIN} variant="body2">Admin</Link>
           </li>
          )}
           <SignOutButton />
       </ul>
);

const NavigationNonAuth = () => (
    <ul>
       <li>
           <Link href={ROUTES.LANDING} variant="body2">Landing</Link>
       </li>
      <li>
           <Link href={ROUTES.SIGN_IN} variant="body2">Sign In</Link>
      </li>
    </ul>
);

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
