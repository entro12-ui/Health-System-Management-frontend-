import React, { useEffect, useState } from 'react';
import { Table, Card, message, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const DoctorNotifications = () => {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [viewedCardNumbers, setViewedCardNumbers] = useState([]);
  const navigate = useNavigate();

  // Load viewed patients from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('viewedCardNumbers');
    if (stored) {
      setViewedCardNumbers(JSON.parse(stored));
    }
  }, []);

  
  const fetchAssigned = async () => {
    try {
      const response = await fetch('http://localhost:4000/doctor-notifications/${type}');
      const data = await response.json();

      if (response.ok) {
        const now = new Date();
        const filtered = data.filter(p => {
        const registeredAt = new Date(p.registered_at);
        const diffInMinutes = (now - registeredAt) / (1000 * 60);
        return !viewedCardNumbers.includes(p.cardno) && diffInMinutes <= 30;
        });

        setAssignedPatients(filtered);
      } else {
        message.error('Failed to load notifications');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Could not connect to server.');
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [viewedCardNumbers]);

  
  const handleAccept = (patient) => {
    const updated = [...viewedCardNumbers, patient.cardno];
    setViewedCardNumbers(updated);
    localStorage.setItem('viewedCardNumbers', JSON.stringify(updated));

    
    setAssignedPatients(prev => prev.filter(p => p.cardno !== patient.cardno));

    // Navigate to patient history
    navigate('/doctors/viewpatienthistory', { state: { patient } });
  };

  const columns = [
    { title: 'Card Number', dataIndex: 'cardno', key: 'cardno' },
    { title: 'First Name', dataIndex: 'fname', key: 'fname' },
    { title: 'Middle Name', dataIndex: 'mname', key: 'mname' },
    { title: 'Last Name', dataIndex: 'lname', key: 'lname' },
    { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth' },
    { title: 'Gender', dataIndex: 'sex', key: 'sex' },
    { title: 'Kebele', dataIndex: 'kebele', key: 'kebele' },
    { title: 'Registered At', dataIndex: 'registered_at', key: 'registered_at' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleAccept(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Doctor Notifications" style={{ margin: '40px auto', maxWidth: 1000 }}>
      <Table
        columns={columns}
        dataSource={assignedPatients}
        rowKey="cardno"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </Card>
  );
};

export default DoctorNotifications;
