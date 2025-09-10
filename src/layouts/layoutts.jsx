import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Switch,
  Avatar,
  Dropdown,
  Modal,
  Descriptions,
  Typography,
  Button
} from 'antd';
import {
  DashboardOutlined,
  LogoutOutlined,
  HistoryOutlined,
  SnippetsOutlined,
  ExperimentOutlined,
  UserOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const Layoutts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username') || 'Doctor';
  const doctorProfile = JSON.parse(localStorage.getItem('doctorProfile'));

  const [theme, setTheme] = useState('dark');
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.setItem('auth', 'false');
      localStorage.removeItem('username');
      navigate('/');
    } else if (key === 'profile') {
      setIsProfileVisible(true);
    } else {
      navigate(`/doctors/${key}`, { state: { username } });
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
      <Sider breakpoint="lg" collapsedWidth="0" theme={theme} style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}>
        <div style={{
          padding: 16,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          <img
            src="https://www.svgrepo.com/show/44400/stethoscope-medical-tool.svg"
            alt="Stethoscope Icon"
            style={{
              width: 24,
              height: 24,
              filter: 'invert(100%) brightness(200%)'
            }}
          />
          Doctor Panel
        </div>

        <Menu
          theme={theme}
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="docdash" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="viewpatienthistory" icon={<ExperimentOutlined />}>Diagnosis</Menu.Item>
          <Menu.Item key="labreport" icon={<SnippetsOutlined />}>Lab Reports</Menu.Item>
          <Menu.Item key="history" icon={<HistoryOutlined />}>Patient History</Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
        </Menu>
      </Sider>

      {/* Main layout */}
      <Layout>
        {/* Header */}
        <Header style={{
          background: theme === 'dark' ? '#1f1f1f' : '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}>
          <div style={{ color: theme === 'dark' ? '#fff' : '#000', fontSize: 18 }}>
            Welcome, Dr. {username}
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

        {/* Content */}
        <Content style={{
          margin: '24px 16px 0',
          padding: 24,
          background: theme === 'dark' ? '#1f1f1f' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          transition: 'all 0.3s ease',
          minHeight: 'calc(100vh - 64px - 70px)',
        }}>
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{
          textAlign: 'center',
          backgroundColor: theme === 'dark' ? '#141414' : '#f0f2f5',
          color: theme === 'dark' ? '#aaa' : '#555',
          padding: '16px 24px',
          fontSize: 14,
          borderTop: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              © {new Date().getFullYear()} <strong>Entro SW Company</strong> — All rights reserved.
            </div>
            <div>
              <a href="/privacy" style={{ marginRight: 16, color: 'inherit' }}>Privacy Policy</a>
              <a href="/terms" style={{ marginRight: 16, color: 'inherit' }}>Terms of Service</a>
              <a href="/support" style={{ color: 'inherit' }}>Support</a>
            </div>
          </div>
        </Footer>
      </Layout>

      {/* Profile Modal */}
      <Modal
        title="Doctor Profile"
        visible={isProfileVisible}
        onCancel={() => setIsProfileVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsProfileVisible(false)}>
            Cancel
          </Button>
        ]}
      >
        {doctorProfile ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Username">{doctorProfile.username}</Descriptions.Item>
            <Descriptions.Item label="Specialty">{doctorProfile.specialty}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Typography.Text type="warning">No profile data found.</Typography.Text>
        )}
      </Modal>
    </Layout>
  );
};

export default Layoutts;