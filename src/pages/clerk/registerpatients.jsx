import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  DatePicker,
  Select
} from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const RegisterPatients = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cardNumber, setCardNumber] = useState('Loading...');

  // Fetch next card number on mount
  useEffect(() => {
    const fetchNextCardNumber = async () => {
      try {
        const response = await fetch('http://localhost:4000/next-cardno');
        const data = await response.json();
        if (response.ok) {
          setCardNumber(data.cardno);
        } else {
          message.error('Failed to fetch card number');
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('Could not connect to server.');
      }
    };

    fetchNextCardNumber();
  }, []);

  const onFinish = async (values) => {
    try {
      const payload = {
        fname: values.fname.trim(),
        middle: values.middle.trim(),
        last: values.last.trim(),
        dob: dayjs(values.dob).format('YYYY-MM-DD'),
        sex: values.sex,
        kebele: values.kebele.trim(),
      };

      const response = await fetch('http://localhost:4000/register-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`User registered successfully! Card Number: ${data.cardno}`);
        setCardNumber(data.cardno); // Update to new card number
        form.resetFields();
        navigate('/clerk/patientlist')
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
    { required: true, message: 'Kebele is required.' },
    {
      pattern: /^[A-Za-z0-9]{2,}$/,
      message: 'Must be at least 2 alphanumeric.',
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
      <Card title="የህሙማን ምዝገባ ቅጽ" style={{ width: 400 }}>
        <Form
          layout="vertical"
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Card Number">
            <Input value={cardNumber} disabled />
          </Form.Item>

          <Form.Item label="First Name" name="fname" rules={nameValidation}>
            <Input placeholder="Enter First name" />
          </Form.Item>

          <Form.Item label="Middle Name" name="middle" rules={nameValidation}>
            <Input placeholder="Enter Middle name" />
          </Form.Item>

          <Form.Item label="Last Name" name="last" rules={nameValidation}>
            <Input placeholder="Enter Last name" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: 'Please select your correct DOB!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select your date of birth"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="sex"
            rules={[{ required: true, message: 'Please select sex' }]}
          >
            <Select placeholder="Select sex">
              <Option value="M">Male</Option>
              <Option value="F">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Kebele" name="kebele" rules={idValidation}>
            <Input placeholder="Enter Kebele" />
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

export default RegisterPatients;