import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
const RegisterDoc = () => {
  const navigate= useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:4000/adddoctors', {
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
            label="First Name"
            name="fname"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Father Name"
            name="faname"
            rules={[{ required: true, message: 'Please input your fathers name!' }]}
          >
            <Input placeholder="Enter father name" />
          </Form.Item>
          <Form .Item
          label="ID number"
          name="idno"
          rules={[{required: true, message:'please  enter your id.'}]}
          >
            <Input placeholder="enter your ID" /></Form .Item>
            <Form.Item
            label="Profession"
            name="profession"
            rules={[{required: true, message: "please enter tour profession"}]}
        >
                <Input placeholder="enter your profession" />
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

export default RegisterDoc;
