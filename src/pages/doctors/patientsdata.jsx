import React, { useEffect, useState } from 'react';
import { Input, Card, Table, Space, message } from 'antd';

const PatientData = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchCardNumber, setSearchCardNumber] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:4000/from-history');
        const data = await response.json();

        if (response.ok) {
          setPatients(data);
          setFilteredPatients(data);
        } else {
          message.error('Failed to load patients data');
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('Could not connect to server.');
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const trimmedSearch = searchCardNumber.trim().toLowerCase();

    if (trimmedSearch === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((p) => {
        const cardNo = (p.cardno || '').trim().toLowerCase();
        return cardNo === trimmedSearch; 
      });
      setFilteredPatients(filtered);
    }
  }, [searchCardNumber, patients]);

  const columns = [
    { title: 'Card Number', dataIndex: 'cardno', key: 'cardno' },
    { title: 'First Name', dataIndex: 'fname', key: 'fname' },
    { title: 'Middle Name', dataIndex: 'mname', key: 'mname' },
    { title: 'Gender', dataIndex: 'sex', key: 'sex' },
    { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Lab Checkups', dataIndex: 'lab_checkups', key: 'lab_checkups' },
    { title: 'Medications', dataIndex: 'doctor_note', key: 'doctor_note' },
  ];

  return (
    <Card
      title="የታካሚዎች ሰነድ"
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

export default PatientData;
