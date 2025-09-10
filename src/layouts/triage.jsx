import React, { useState } from 'react';
import { Layout, Menu, Switch } from 'antd';
import {
  DashboardOutlined,
  LogoutOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content, Footer } = Layout;

const TriageLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username') || 'User';
  const [theme, setTheme] = useState('dark'); // dark or light

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.setItem('auth', 'false');
      localStorage.removeItem('username');
      navigate('/');
    } else {
      navigate(`/triage/${key}`, { state: { username } });
    }
  };

  const toggleTheme = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const currentKey = location.pathname.split('/').pop();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme={theme}
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}
      >
        {/* Logo + Theme Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 16,
          paddingBottom: 8,
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
            Triage Panel
          </div>
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            size="small"
          />
        </div>

        {/* Navigation Menu */}
        <Menu
          theme={theme}
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="triagedash" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="triageview" icon={<MedicineBoxOutlined />}>
            View Latest Patients
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content
          style={{
            margin: '24px 16px 0',
            padding: 24,
            background: theme === 'dark' ? '#1f1f1f' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            transition: 'background 0.3s ease',
            minHeight: 'calc(100vh - 64px - 70px)', // Adjust for header/footer
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

export default TriageLayout;