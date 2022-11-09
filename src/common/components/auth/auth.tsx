import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { UserCard } from '../user-card';

export function Auth(): JSX.Element {
  const { loginWithPopup, user, isLoading } = useAuth0();

  return (
    <div>
      {!user && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <>
            Unauthenticated{' '}
            <button onClick={loginWithPopup}>Log In using Auth0</button>{' '}
          </>
        </div>
      )}
      {!!user && <p>Hello! Welcome to masa tools! </p>}
      {(!!user || isLoading) && <UserCard loading={isLoading} user={user} />}
    </div>
  );
}

export interface Props {}
