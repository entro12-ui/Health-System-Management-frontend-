import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const TriageDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || localStorage.getItem('username') || 'User';


  return (
      <Layout>
        <Content >
          <h1>Welcome, {username}!</h1>
          <p>This is your dashboard mate.</p>
        </Content>
      </Layout>
  );
};

export default TriageDashboard;
