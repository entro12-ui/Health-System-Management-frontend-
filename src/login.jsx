import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
const RegisterForm = () => {
  const navigate= useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:4000/adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('User registered successfully!');
        //navigate('/dash')
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
      <Card title="መዝገብ" style={{ width: 400 }}>
        <Form
          layout="vertical"
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
            መዝገብ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;
