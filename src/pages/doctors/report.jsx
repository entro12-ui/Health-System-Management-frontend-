import React, { useEffect, useState } from 'react';
import { Typography, Button, message, Input, Card, Spin } from 'antd';

const DoctorLabNotifications = () => {
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorNote, setDoctorNote] = useState('');
  const { TextArea } = Input;

  
  const doctorProfile = JSON.parse(localStorage.getItem('doctorProfile'));
  const doctorSpecialty = doctorProfile?.specialty?.toLowerCase() || '';

  const fetchLatestLabResult = async () => {
    try {
      const res = await fetch(`http://localhost:4000/lab-results?specialty=${doctorSpecialty}`);
      const data = await res.json();
      if (data.length > 0) {
        setLatestResult(data[0]); // Show only the most recent result
      } else {
        setLatestResult(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      message.error('Failed to fetch lab results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestLabResult();
    const interval = setInterval(fetchLatestLabResult, 10000); 
    return () => clearInterval(interval);
  }, []);

  const handleSendToPharmacist = async () => {
    if (!latestResult) return;

    try {
      const payload = {
        ...latestResult,
        doctor_note: doctorNote,
      };

      const response = await fetch('http://localhost:4000/send-to-pharmacist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success('Sent to pharmacist successfully!');
        setDoctorNote('');
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      console.error('Send error:', err);
      message.error('Could not send to pharmacist');
    }
  };

  if (loading) return <Spin style={{ margin: 50 }} size="large" />;

  if (!latestResult) {
    return (
      <div style={{ padding: '20px' }}>
        <Card style={{ marginBottom: 20 }}>
          <Typography.Title level={4}>Lab Request Status</Typography.Title>
          <Typography.Text type="warning">
            Dr, You did not send a lab request!
          </Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3}>Latest Lab Result for Review</Typography.Title>

      <Card style={{ marginBottom: 20 }}>
        <Typography.Title level={5}>
          Patient: {latestResult.fullname}
        </Typography.Title>
        <p><strong>Card Number:</strong> {latestResult.cardno}</p>
        <p><strong>Diagnosis:</strong> {latestResult.diagnosis}</p>
        <p><strong>Treatment:</strong> {latestResult.treatment}</p>
        <p><strong>Checkups:</strong> {latestResult.lab_checkups}</p>
        <p><strong>Lab Result:</strong> {latestResult.lab_result}</p>

        <TextArea
          placeholder="Doctor's note to pharmacist"
          value={doctorNote}
          onChange={(e) => setDoctorNote(e.target.value)}
          rows={6}
          style={{ width: '100%' }}
        />

        <Button type="primary" onClick={handleSendToPharmacist}>
          Send to Pharmacist
        </Button>
      </Card>
    </div>
  );
};

export default DoctorLabNotifications;