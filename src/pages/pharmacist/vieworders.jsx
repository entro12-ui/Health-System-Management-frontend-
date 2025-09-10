import React, { useEffect, useState, useRef } from 'react';
import { Input, Card, Table, Space, message, Button, notification } from 'antd';

const GiveMedics = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchCardNumber, setSearchCardNumber] = useState('');
  const [doneCardNumbers, setDoneCardNumbers] = useState([]);
  const notificationSoundRef = useRef(null);
  const previousPatientsRef = useRef([]);

  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch(() => {});
    }
  };

 
  useEffect(() => {
    const stored = localStorage.getItem('doneCardNumbers');
    if (stored) {
      setDoneCardNumbers(JSON.parse(stored));
    }
  }, []);


  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:4000/pharma-requests');
      const data = await response.json();

      if (response.ok) {
        const visible = data.filter((p) => !doneCardNumbers.includes(p.cardno));
        setPatients(visible);
        setFilteredPatients(visible);

        // Compare with previous data
        const prevCardNumbers = previousPatientsRef.current.map(p => p.cardno);
        const newCardNumbers = visible.map(p => p.cardno);
        const newlyAdded = newCardNumbers.filter(cardno => !prevCardNumbers.includes(cardno));

        if (newlyAdded.length > 0) {
          notification.open({
            message: 'New Medicine Request',
            description: 'A new patient has been sent from the doctor.',
            placement: 'topRight',
            duration: 3,
          });
          playNotificationSound();
        }

        
        previousPatientsRef.current = visible;
      } else {
        message.error('Failed to load patients');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Could not connect to server.');
    }
  };

  useEffect(() => {
    fetchPatients(); 
    const interval = setInterval(fetchPatients, 15000); 
    return () => clearInterval(interval);
  }, [doneCardNumbers]);

  
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

 
  const handleMarkDone = (cardno) => {
    const updated = [...doneCardNumbers, cardno];
    localStorage.setItem('doneCardNumbers', JSON.stringify(updated));
    setDoneCardNumbers(updated);
    message.success(`Marked ${cardno} as done`);
  };

  const columns = [
    { title: 'Card Number', dataIndex: 'cardno', key: 'cardno' },
    { title: 'Full Name', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Doctors Note', dataIndex: 'doctor_note', key: 'doctor_note' },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => handleMarkDone(record.cardno)}
        >
          Done
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="የመድሃኒት ተጠቃሚዎች"
      extra={
        <Space>
          <Input
            placeholder="Search by Card Number"
            value={searchCardNumber}
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
      
      <audio ref={notificationSoundRef} src="/notification.mp3" preload="auto" />

      <Table
        columns={columns}
        dataSource={filteredPatients}
        pagination={{ pageSize: 5 }}
        rowKey="cardno"
        bordered
      />
    </Card>
  );
};

export default GiveMedics;