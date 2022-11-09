import React from 'react';

import { useAuth0, User } from '@auth0/auth0-react';

export interface UserCardProps {
  loading?: boolean;
  user?: User;
}

export function UserCard({}: UserCardProps) {
  return <div>Not available</div>;
}
