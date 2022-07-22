import React from 'react';
import { Skeleton, Card, Avatar } from 'antd';
import { Popconfirm } from 'antd';

import {
  EditOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth0, User } from '@auth0/auth0-react';

const { Meta } = Card;

export interface UserCardProps {
  loading: boolean;
  user?: User;
}

export function UserCard({ user, loading }: UserCardProps) {
  const { logout } = useAuth0();
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <Card
      style={{ width: 300, marginTop: 16 }}
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <Popconfirm
          title="Are you sure?"
          onConfirm={handleLogout}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <LogoutOutlined key="logout" color="#DEDEDE" />
        </Popconfirm>,
      ]}
    >
      <Skeleton loading={loading} avatar active>
        <Meta
          avatar={<Avatar src={user?.picture} />}
          title={user?.name}
          description={user?.email}
        />
      </Skeleton>
    </Card>
  );
}
