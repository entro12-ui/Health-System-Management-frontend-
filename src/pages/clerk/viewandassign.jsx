import React, { useEffect, useState } from 'react';
import { Input, Card, Table, Space, message, Button } from 'antd';
import dayjs from 'dayjs';

const ViewAndAssign = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchCardNumber, setSearchCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/assigned-existing-patients');
      const data = await response.json();

      if (response.ok) {
        setPatients(data);
        setFilteredPatients(data);
      } else {
        message.error('Failed to load patients');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + polling every 30 seconds
  useEffect(() => {
    fetchPatients(); // initial load

    const interval = setInterval(() => {
      fetchPatients(); // refresh every 30 seconds
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter patients by card number
  useEffect(() => {
    const trimmed = searchCardNumber.trim().toLowerCase();
    if (trimmed === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((p) =>
        p.cardno?.toLowerCase().includes(trimmed)
      );
      setFilteredPatients(filtered);
    }
  }, [searchCardNumber, patients]);

  // Send patient to triage by updating registered_at
  const handleSendToTriage = async (cardno) => {
    try {
      const response = await fetch('http://localhost:4000/update-and-send-to-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardno }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(`Patient ${cardno} sent to triage`);
        await fetchPatients();
        setSearchCardNumber('');
      } else {
        message.error(result.error || 'Failed to send to triage');
      }
    } catch (error) {
      console.error('Error sending to triage:', error);
      message.error('Server error during assignment');
    }
  };

  // Table columns
  const columns = [
    { title: 'Card Number', dataIndex: 'cardno', key: 'cardno' },
    {
      title: 'Full Name',
      key: 'fullname',
      render: (_, record) => {
        const { fname = '', mname = '', lname = '' } = record;
        return `${fname} ${mname} ${lname}`.trim();
      },
    },
    { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth' },
    { title: 'Gender', dataIndex: 'sex', key: 'sex' },
    { title: 'Kebele', dataIndex: 'kebele', key: 'kebele' },
    {
      title: 'Registered At',
      dataIndex: 'registered_at',
      key: 'registered_at',
      render: (value) =>
        value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '—',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleSendToTriage(record.cardno)}>
          Send
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="የተመዘገቡ ህመምተኞች"
      extra={
        <Space>
          <Input
            placeholder="Search by Card Number"
            value={searchCardNumber}
            name="cardno"
            onChange={(e) => setSearchCardNumber(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      }
      style={{
        maxWidth: 1000,
        margin: '40px auto',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '12px',
      }}
    >
      <Table
        columns={columns}
        dataSource={filteredPatients}
        pagination={{ pageSize: 5 }}
        rowKey="cardno"
        bordered
        loading={loading}
      />
    </Card>
  );
};

export default ViewAndAssign;
