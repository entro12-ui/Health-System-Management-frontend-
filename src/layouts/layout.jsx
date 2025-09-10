import React, { useState } from 'react';
import { Layout, Menu, Switch, Dropdown, Avatar, Divider } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const Layoutt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username') || 'Admin';
  const [theme, setTheme] = useState('dark');

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.setItem('auth', 'false');
      localStorage.removeItem('username');
      navigate('/');
    } else {
      navigate(`/admin/${key}`, { state: { username } });
    }
  };

  const toggleTheme = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const currentKey = location.pathname.split('/').pop();

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme={theme}
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}
      >
        <div style={{
          padding: '16px',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 20,
          textAlign: 'center'
        }}>
          MedTrack Admin
        </div>

        <Divider style={{ borderColor: theme === 'dark' ? '#333' : '#ccc' }} />

        <Menu
          theme={theme}
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dash" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>

          <Menu.SubMenu key="doctor" icon={<UserOutlined />} title="Doctor Management">
            <Menu.Item key="reg" icon={<PlusCircleOutlined />}>Register Doctor</Menu.Item>
            <Menu.Item key="docacc" icon={<AppstoreOutlined />}>Doctor Accounts</Menu.Item>
            <Menu.Item key="doclist" icon={<TeamOutlined />}>List of Doctors</Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="accounts" icon={<SettingOutlined />} title="User Accounts">
            <Menu.Item key="clerklist">Clerk</Menu.Item>
            <Menu.Item key="tiragelist">Triage</Menu.Item>
            <Menu.Item key="laboratorylist">Laboratory</Menu.Item>
            <Menu.Item key="pharmalist">Pharmacy</Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        {/* Header Bar */}
        <Header
          style={{
            background: theme === 'dark' ? '#1f1f1f' : '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
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
            />
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>

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

export default Layoutt;
