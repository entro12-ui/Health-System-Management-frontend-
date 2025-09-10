
import React, { useState } from 'react';
//import Link from 'next/link';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';
//import { useRouter } from 'next/navigation';

const { Sider, Header, Content } = Layout;

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [current, setCurrent] = useState('1');
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('role');
    router.replace('/');
  };

  const changeTheme = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      key: 'sub1',
      label: 'Main Tasks',
      icon: <UnorderedListOutlined />,
      children: [
        {
          key: '1',
          icon: <UserOutlined />,
          label: <Link href="/admin/register">Register</Link>,
        },
        {
          key: '2',
          icon: <ProfileOutlined />,
          label: <Link href="/admin/view">View Employee</Link>,
        },
        {
          key: '3',
          icon: <TeamOutlined />,
          label: <Link href="/admin/count">No. of users</Link>,
        },
        {
          key: '4',
          icon: <LogoutOutlined />,
          label: (
            <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </span>
          ),
        },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            { key: '7', label: 'Option 7' },
            { key: '8', label: 'Option 8' },
          ],
        },
      ],
    },
    {
      key: 'sub4',
      label: 'Navigation Three',
      icon: <SettingOutlined />,
      children: [
        { key: '9', label: 'Option 9' },
        { key: '10', label: 'Option 10' },
        { key: '11', label: 'Option 11' },
        { key: '12', label: 'Option 12' },
      ],
    },
  ];

  const iconStyle = {
    fontSize: '18px',
    color: theme === 'dark' ? '#fff' : '#333',
    transition: 'transform 0.2s ease, color 0.2s ease',
    cursor: 'pointer',
  };

  const iconHoverStyle = {
    transform: 'scale(1.2)',
    color: theme === 'dark' ? '#40a9ff' : '#1890ff',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme={theme}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Switch
            checked={theme === 'dark'}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </div>
        <Menu
          theme={theme}
          mode="inline"
          onClick={onClick}
          defaultOpenKeys={['sub1']}
          selectedKeys={[current]}
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(90deg, #001529, #003a8c)'
              : 'linear-gradient(90deg, #ffffff, #e6f7ff)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 24px',
            gap: '20px',
          }}
        >
          {[UserOutlined, BellOutlined, SettingOutlined].map((Icon, index) => (
            <Icon
              key={index}
              style={{
                ...iconStyle,
                ...(hoveredIcon === index ? iconHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredIcon(index)}
              onMouseLeave={() => setHoveredIcon(null)}
            />
          ))}
        </Header>

        <Content
          style={{
            margin: '20px',
            padding: '20px',
            background: '#fff',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}