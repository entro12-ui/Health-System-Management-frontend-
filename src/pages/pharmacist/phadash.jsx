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

const PharmaDash = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || localStorage.getItem('username') || 'User';

  

  return (

      <Layout>
        <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff', alignItems: "center"}}>
          <h1>Welcome, {username}!</h1>
          <p>This is {username} 's dashboard mate.</p>
        </Content>
      </Layout>
  );
};

export default PharmaDash;
