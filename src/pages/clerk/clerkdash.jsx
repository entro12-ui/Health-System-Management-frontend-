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

const ClerkDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || localStorage.getItem('username') || 'User';
  return (
      <Layout>
        <Content >
          
          <p>This is your dashboard mate.</p>
        </Content>
      </Layout>
  );
};

export default ClerkDashboard;
