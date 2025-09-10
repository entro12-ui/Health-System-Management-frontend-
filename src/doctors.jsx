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

const Doctors = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('username'); // Clear any stored user info
    navigate('/'); // Redirect to login page
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" style={{ height: 32, margin: 16, color: '#fff', fontSize: 20 }}>
          MyApp
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff' }}>
          <h1>Welcome, {username}!</h1>
          <p>This is your dashboard mate.</p>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Doctors;
