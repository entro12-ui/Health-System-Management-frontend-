import React, { useState } from 'react';
import { Layout, Menu, Switch, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  LogoutOutlined,
  SolutionOutlined,
  PlusSquareOutlined,
  UserOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const ClerkLayoutt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username') || 'Clerk';
  const [theme, setTheme] = useState('dark');

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.setItem('auth', 'false');
      localStorage.removeItem('username');
      navigate('/');
    } else {
      navigate(`/clerk/${key}`, { state: { username } });
    }
  };

  const toggleTheme = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const currentKey = location.pathname.split('/').pop();

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        theme={theme}
        breakpoint="lg"
        collapsedWidth="0"
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}
      >
        <div style={{
          padding: 16,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
        }}>
          Clerk Panel
        </div>

        <Menu
          theme={theme}
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dash" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="patient" icon={<PlusSquareOutlined />}>
            Register Patient
          </Menu.Item>
          <Menu.Item key="patientlist" icon={<SolutionOutlined />}>
            View Patients
          </Menu.Item>
          <Menu.Item key="viewandassign" icon={<SolutionOutlined />}>
            Assign to Triage
          </Menu.Item>
          
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: theme === 'dark' ? '#1f1f1f' : '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={{ color: theme === 'dark' ? '#fff' : '#000', fontSize: 18 }}>
            Welcome, {username}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BulbOutlined />
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              size="small"
            />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>

        {/* Main content */}
        <Content
          style={{
            margin: '24px 16px 0',
            padding: 24,
            background: theme === 'dark' ? '#1f1f1f' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            transition: 'all 0.3s ease',
            minHeight: 'calc(100vh - 64px - 70px)',
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: theme === 'dark' ? '#141414' : '#f0f2f5',
            color: theme === 'dark' ? '#aaa' : '#555',
            padding: '16px 24px',
            fontSize: 14,
            borderTop: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              © {new Date().getFullYear()} <strong>MedTrack</strong> — All rights reserved.
            </div>
            <div>
              <a href="/privacy" style={{ marginRight: 16, color: 'inherit' }}>Privacy Policy</a>
              <a href="/terms" style={{ marginRight: 16, color: 'inherit' }}>Terms of Service</a>
              <a href="/support" style={{ color: 'inherit' }}>Support</a>
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ClerkLayoutt;
