import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Displaying = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.error) {
      message.error(location.state.error);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const onFinish = async (values) => {
    try {
      const res = await fetch('http://localhost:4000/checking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
  
      const data = await res.json();
  
      if (data.found) {
        message.success(data.message);
        localStorage.setItem('auth', 'true');
  
        let targetRoute = '/';
  
        if (data.type === 'doctor') {
          if (data.profession) {
            // ✅ Store doctor profile with specialty
            localStorage.setItem('doctorProfile', JSON.stringify({
              username: values.username,
              specialty: data.profession
            }));
  
            const specializationPath = data.profession.toLowerCase().replace(/\s+/g, '-');
            targetRoute = `/doctors/${specializationPath}`;
            navigate('/doctors/notifications');
          } else {
            message.warning('Doctor specialization not found');
            return;
          }
        } else {
          const routes = {
            account: '/admin/dash',
            clerk: '/clerk/dash',
            triage: '/triage/triagedash',
            laboratorist: '/laboratorist/labdash',
            pharma: '/pharmacist/pharmadash',
          };
  
          targetRoute = routes[data.type] || '/';
        }
  
        navigate(targetRoute, { state: { username: values.username } });
      } else {
        message.warning(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      message.error('Something went wrong during login.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #667eea, #764ba2, #6b8dd6, #8e44ad)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <Card
        bordered={false}
        style={{
          width: 400,
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          padding: '40px 30px',
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={3} style={{ color: '#fff', marginBottom: 0 }}>
            Patient Management
          </Title>
          <Text style={{ color: '#ddd' }}>Please login to your account</Text>
        </div>

        <Form layout="vertical" name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label={<Text style={{ color: '#fff' }}>Username</Text>}
            name="username"
            rules={[{ required: true, message: 'Please input your username or ID number!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label={<Text style={{ color: '#fff' }}>Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 'bold',
                fontSize: 16,
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#5563c1';
                e.currentTarget.style.borderColor = '#5563c1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.borderColor = '#667eea';
              }}
            >
              Login
            </Button>
          </Form.Item>

          {/* 🔐 Forgot Password Link */}
          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link to="/forgot-password">
              <Text style={{ color: '#fff', textDecoration: 'underline' }}>
                Forgot Password?
              </Text>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default Displaying;