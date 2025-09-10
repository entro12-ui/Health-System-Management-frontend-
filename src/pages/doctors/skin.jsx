import React, { useEffect, useState, useRef } from 'react';
import { Table, Card, message, Space, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const SkinDoctor = () => {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [viewedCardNumbers, setViewedCardNumbers] = useState([]);
  const [previousCardNumbers, setPreviousCardNumbers] = useState([]);
  const navigate = useNavigate();
  const notificationSoundRef = useRef(null);

  const LOCAL_STORAGE_KEY = 'viewedCardNumbers_skin';

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setViewedCardNumbers(JSON.parse(stored));
    }
  }, []);

  
  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch((err) => {
        console.warn('Sound playback error:', err);
      });
    }
  };

  
  const fetchAssigned = async () => {
    try {
      const response = await fetch('http://localhost:4000/doctor-notifications/type?type=skin');
      const data = await response.json();

      if (response.ok) {
        const now = new Date();

        const filtered = data.filter(p => {
          const registeredAt = new Date(p.registered_at);
          const diffInMinutes = (now - registeredAt) / (1000 * 60);
          return !viewedCardNumbers.includes(p.cardno) && diffInMinutes <= 30;
        });

        const currentCardNumbers = filtered.map(p => p.cardno);
        const newOnes = currentCardNumbers.filter(cn => !previousCardNumbers.includes(cn));

        if (newOnes.length > 0) {
          notification.open({
            message: 'New Patient Assigned',
            description: 'A new patient has been assigned to you by triage.',
            placement: 'topRight',
            duration: 3,
          });
          playNotificationSound();
        }

        setAssignedPatients(filtered);
        setPreviousCardNumbers(currentCardNumbers);
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
    const interval = setInterval(fetchAssigned, 15000);
    return () => clearInterval(interval);
  }, [viewedCardNumbers]);

  
  const handleAccept = (patient) => {
    const updated = [...viewedCardNumbers, patient.cardno];
    setViewedCardNumbers(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    setAssignedPatients(prev => prev.filter(p => p.cardno !== patient.cardno));
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
    <Card title="Skin Doctor Notifications" style={{ margin: '40px auto', maxWidth: 1000 }}>
     
      <audio ref={notificationSoundRef} src="/notification.mp3" preload="auto" />
      
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

export default SkinDoctor;
