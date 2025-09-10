import React, { useEffect, useState, useRef } from 'react';
import { Card, Form, Input, Spin, Alert, Button, message, notification } from 'antd';

const ViewLabRequests = () => {
  const [labRequests, setLabRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});
  const [previousIds, setPreviousIds] = useState([]);
  const { TextArea } = Input;
  const notificationSoundRef = useRef(null);


  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch(() => {});
    }
  };

  const fetchLabRequests = async () => {
    try {
      const response = await fetch('http://localhost:4000/lab-requests');
      if (!response.ok) throw new Error('Failed to fetch lab requests');
      const data = await response.json();

      const latestIds = data.map((req) => req.id); // assuming `id` is unique
      const newOnes = latestIds.filter(id => !previousIds.includes(id));

      if (newOnes.length > 0) {
        notification.open({
          message: 'New Lab Request',
          description: 'A new lab request has been assigned.',
          placement: 'topRight',
          duration: 3,
        });
        playNotificationSound();
      }

      setLabRequests(data);
      setPreviousIds(latestIds);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabRequests();
    const interval = setInterval(fetchLabRequests, 15000);
    return () => clearInterval(interval);
  }, [previousIds]);

  const handleResultChange = (value) => {
    setResults({ 0: value });
  };

  const handleSendResult = async () => {
    const latestRequest = labRequests[labRequests.length - 1];
    const resultText = results[0];

    if (!resultText) {
      return message.warning('Please enter a result before sending.');
    }

    try {
      const response = await fetch('http://localhost:4000/lab-results/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...latestRequest,
          lab_result: resultText,
        }),
      });

      if (response.ok) {
        message.success('Result sent successfully!');
        setResults({});
      } else {
        throw new Error('Failed to send result');
      }
    } catch (err) {
      console.error('Send error:', err);
      message.error('Error sending result');
    }
  };

  if (loading) return <Spin style={{ margin: 50 }} size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  const latestRequest = labRequests[labRequests.length - 1];

  return (
    <div style={{ padding: '30px' }}>
      <audio ref={notificationSoundRef} src="/notification.mp3" preload="auto" />
      {!latestRequest ? (
        <Alert message="No lab requests found" type="info" />
      ) : (
        <Card title="Latest Lab Request" style={{ marginBottom: 20, maxWidth: 700 }}>
          <Form layout="vertical">
            <Form.Item label="Card Number">
              <Input value={latestRequest.cardno} disabled />
            </Form.Item>
            <Form.Item label="Full Name">
              <Input value={latestRequest.fullname} disabled />
            </Form.Item>
            <Form.Item label="Diagnosis">
              <Input value={latestRequest.diagnosis} disabled />
            </Form.Item>
            <Form.Item label="Treatment">
              <Input value={latestRequest.treatment} disabled />
            </Form.Item>
            <Form.Item label="Lab Checkups">
              <TextArea
                value={
                  latestRequest.lab_checkups?.join?.(', ') || latestRequest.lab_checkups
                }
                disabled
                autoSize
              />
            </Form.Item>

            <Form.Item label="Lab Result">
              <TextArea
                placeholder="Enter test result here"
                value={results[0] || ''}
                onChange={(e) => handleResultChange(e.target.value)}
                style={{ width: '100%', height: '150px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleSendResult}>
                Send Result
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ViewLabRequests;
