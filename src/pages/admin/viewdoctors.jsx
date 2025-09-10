import React, { useEffect, useState } from 'react';
import { Table, Card, message, Input, Space } from 'antd';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const response = await fetch('http://localhost:4000/get-all-doctors');
        const data = await response.json();

        if (response.ok) {
          setDoctors(data);
          setFilteredDoctors(data);
        } else {
          message.error('Failed to load doctors');
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('Could not connect to server.');
      }
    };

    fetchAllDoctors();
  }, []);

  useEffect(() => {
    const trimmed = searchId.trim().toLowerCase();

    if (trimmed === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doc) =>
        doc.idnumber?.toLowerCase().includes(trimmed)
      );
      setFilteredDoctors(filtered);
    }
  }, [searchId, doctors]);

  const columns = [
    { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Father Name', dataIndex: 'fathername', key: 'fathername' },
    { title: 'ID Number', dataIndex: 'idnumber', key: 'idnumber' },
    { title: 'Profession', dataIndex: 'profession', key: 'profession' },
  ];

  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        title="List of Doctors"
        extra={
          <Space>
            <Input
              placeholder="Search by ID Number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey="idnumber"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default DoctorsList;