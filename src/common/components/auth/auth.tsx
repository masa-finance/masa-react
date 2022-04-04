import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Typography } from 'antd';

import { Button } from 'antd';
import { UserCard } from '../user-card';

const { Title } = Typography;

export function Auth(): JSX.Element {
  const { loginWithPopup, user, isLoading } = useAuth0();

  return (
    <div>
      {!user && (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Title level={3}>
            Unauthenticated{' '}
            <Button onClick={loginWithPopup}>Log In using Auth0</Button>{' '}
          </Title>
        </div>
      )}
      {!!user && <Title level={3}>Hello! Welcome to masa tools! </Title>}
      {(!!user || isLoading) && <UserCard loading={isLoading} user={user} />}
    </div>
  );
}

export interface Props {}
