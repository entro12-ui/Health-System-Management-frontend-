import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const PatientHistoryForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const patient = state?.patient;

  const [form] = Form.useForm();

  // Initialize form values on mount
  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        cardno: patient.cardno,
        fullname: `${patient.fname} ${patient.mname} ${patient.lname}`,
        date_of_birth: new Date(patient.date_of_birth).toLocaleDateString(),
        sex: patient.sex,
        kebele: patient.kebele,
        type: patient.type,
      });
    }
  }, [patient, form]);

  const handleSubmit = async (values) => {
    const payload = {
      ...patient,
      ...values,
    };

    try {
      const historyRes = await fetch('http://localhost:4000/patient-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const labReqRes = await fetch('http://localhost:4000/lab-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardno: patient.cardno,
          fullname: `${patient.fname} ${patient.mname} ${patient.lname}`,
          diagnosis: values.diagnosis,
          treatment: values.type,
          lab_checkups: values.lab_checkups,
        }),
      });

      if (!historyRes.ok) {
        message.error('Failed to save patient history');
      } else if (!labReqRes.ok) {
        message.error('Failed to send lab request');
      } else {
        message.success('Patient history saved and lab request sent');
        form.resetFields();
        navigate('/doctors/viewpatienthistory');
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error('Could not connect to server.');
    }
  };

  return (
    <Card title="Patient History Form" style={{ margin: '40px auto', maxWidth: 600 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="cardno" label="Card Number">
          <Input disabled />
        </Form.Item>
        <Form.Item name="fullname" label="Full Name">
          <Input disabled />
        </Form.Item>
        <Form.Item name="date_of_birth" label="Date of Birth">
          <Input disabled />
        </Form.Item>
        <Form.Item name="sex" label="Gender">
          <Input disabled />
        </Form.Item>
        <Form.Item name="kebele" label="Kebele">
          <Input disabled />
        </Form.Item>
        <Form.Item name="type" label="Treatment">
          <Input disabled />
        </Form.Item>

        <Form.Item
              name="diagnosis"
             label="Diagnosis"
              rules={[{ required: true }]}
           >
            <Input.TextArea rows={4} />
       </Form.Item>



        <Form.Item
          name="lab_checkups"
          label="Laboratory Checkups"
          rules={[{ required: true, message: 'Please select at least one lab test' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select lab tests performed"
            options={[
              { label: 'Urine Test', value: 'Urine Test' },
              { label: 'Stool Test', value: 'Stool Test' },
              { label: 'Blood Test', value: 'Blood Test' },
              { label: 'CBC (Complete Blood Count)', value: 'CBC' },
              { label: 'Blood Sugar', value: 'Blood Sugar' },
              { label: 'Blood Culture', value: 'Blood Culture' },
              { label: 'X-Ray', value: 'X-Ray' },
              { label: 'Ultrasound', value: 'Ultrasound' },
              { label: 'Pregnancy Test', value: 'Pregnancy Test' },
              { label: 'Malaria Test', value: 'Malaria Test' },
              { label: 'HIV Test', value: 'HIV Test' },
              { label: 'Sputum Test', value: 'Sputum Test' },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Save and Send</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PatientHistoryForm;
