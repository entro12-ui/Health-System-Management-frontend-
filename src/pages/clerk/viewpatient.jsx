import React, { useEffect, useState } from 'react';
import { Input, Card, Table, Space, message } from 'antd';

const ViewPatient = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchCardNumber, setSearchCardNumber] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:4000/registered-patients');
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
      }
    };

    fetchPatients();
  }, []);

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

  const columns = [
    { title: 'Card Number', dataIndex: 'cardno', key: 'cardno' },
    { title: 'First Name', dataIndex: 'fname', key: 'fname' },
    { title: 'Middle Name', dataIndex: 'mname', key: 'mname' },
    { title: 'Last Name', dataIndex: 'lname', key: 'lname' },
    { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth' },
    { title: 'Gender', dataIndex: 'sex', key: 'sex' },
    { title: 'Kebele', dataIndex: 'kebele', key: 'kebele' },
    { title: 'Registered At', dataIndex: 'registered_at', key: 'registered_at' },
  ];

  return (
    <Card
      title="የተመዘገቡ ህመምተኞች"
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

export default ViewPatient;