import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const RegisterClerk = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // Trim values before sending
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    try {
      const response = await fetch('http://localhost:4000/register-clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedValues),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('User registered successfully!');
        // navigate('/dash');
      } else {
        message.error(data.error || 'Failed to register user.');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Could not connect to server.');
    }
  };
 

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card title="Create Account For Clerk" style={{ width: 400 }}>
        <Form
          layout="vertical"
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Username" name="username" >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item label="Passoword" name="password" >
            <Input placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterClerk;
