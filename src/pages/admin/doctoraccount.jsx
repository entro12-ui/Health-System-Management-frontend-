import React from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const DocAccount = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // Trim values before sending
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    try {
      const response = await fetch('http://localhost:4000/docaccount', {
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

  const nameValidation = [
    { required: true, message: 'This field is required!' },
    {
      pattern: /^[A-Za-z\s]{2,}$/,
      message: 'Only letters allowed, minimum 2 characters.',
    },
  ];

  const idValidation = [
    { required: true, message: 'ID number is required.' },
    {
      pattern: /^[A-Za-z0-9]{4,}$/,
      message: 'ID must be at least 4 characters and alphanumeric.',
    },
  ];

  const professionValidation = [
    { required: true, message: 'Profession is required.' },
    {
      min: 8,
      message: 'Profession must be at least 8 characters.',
    },
  ];

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

          <Form.Item label="First Name" name="fname" rules={nameValidation}>
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item label="Father Name" name="faname" rules={nameValidation}>
            <Input placeholder="Enter father name" />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="sex"
            rules={[{ required: true, message: 'Please select sex' }]}
          >
            <Select placeholder="Select sex">
              <Option value="M">M</Option>
              <Option value="F">F</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Specialization" name="specialization" rules={professionValidation}>
            <Input placeholder="Enter your profession" />
          </Form.Item>
          <Form.Item label="Username" name="username" rules={nameValidation}>
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={nameValidation}>
            <Input placeholder="Enter password" />
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

export default DocAccount;
