import React, { useEffect, useState } from 'react';
import { Input, Card, Table, Space, message, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AssignPatient = () => {
  const [patients, setPatients] = useState([]);
  const [searchCardNumber, setSearchCardNumber] = useState('');
  const [assignedCardNumber, setAssignedCardNumber] = useState(null);
  const [typeSelections, setTypeSelections] = useState({});
  const navigate = useNavigate();

  // Fetch latest patient
  useEffect(() => {
    const fetchLatestPatient = async () => {
      try {
        const response = await fetch('http://localhost:4000/latest-patient');
        const data = await response.json();
        if (response.ok) {
          setPatients(data);
        } else {
          message.error('Failed to load patient');
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('Could not connect to server.');
      }
    };

    fetchLatestPatient();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.cardno?.toLowerCase().includes(searchCardNumber.trim().toLowerCase())
  );

  const handleTypeChange = (cardno, value) => {
    setTypeSelections((prev) => ({
      ...prev,
      [cardno]: value,
    }));
  };

  const handleAssign = async (cardno) => {
    const patient = patients.find((p) => p.cardno === cardno);
    if (!patient) {
      message.error('Patient not found');
      return;
    }

    const type = typeSelections[cardno];
    if (!type) {
      message.warning('Please select a disease type.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/assign-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...patient, type }),
      });

      if (response.ok) {
        message.success(`Assigned ${cardno} (${type})`);
        setAssignedCardNumber(cardno);

       // const path = `/doctors/${type.toLowerCase().replace(/\s+/g, '-')}`;
       // navigate(path);

      } else {
        let data = {};
        try {
          data = await response.json();
        } catch {}
        message.error(data.error || 'Failed to assign patient');
      }
    } catch (error) {
      console.error('Assignment failed:', error);
      message.error('Server error during assignment');
    }
  };

  const columns = [
    { title: 'Card No.', dataIndex: 'cardno', key: 'cardno', width: 100 },
    {
      title: 'Name',
      key: 'name',
      width: 180,
      render: (_, record) => `${record.fname} ${record.mname || ''} ${record.lname}`,
    },
    { title: 'Gender', dataIndex: 'sex', key: 'sex', width: 80 },
    { title: 'DOB', dataIndex: 'date_of_birth', key: 'date_of_birth', width: 100 },
    { title: 'Kebele', dataIndex: 'kebele', key: 'kebele', width: 100 },
    {
      title: 'Registered At',
      dataIndex: 'registered_at',
      key: 'registered_at',
      width: 160,
    },
    {
      title: 'Type',
      key: 'type',
      width: 160,
      render: (_, record) => (
        <Select
          placeholder="Select type"
          name="type"
          value={typeSelections[record.cardno]}
          onChange={(value) => handleTypeChange(record.cardno, value)}
          style={{ width: '100%' }}
        >
          <Option value="Eye">Eye</Option>
          <Option value="Brain">Brain</Option>
          <Option value="Skin">Skin</Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => {
        const isAssigned = assignedCardNumber === record.cardno;
        return (
          <Button
            type="primary"
            disabled={isAssigned}
            onClick={() => handleAssign(record.cardno)}
            style={{ width: '100%' }}
          >
            {isAssigned ? 'Assigned' : 'Assign'}
          </Button>
        );
      },
    },
  ];

  return (
    <Card
      title="የተመዘገቡ ህመምተኞች (Latest Update Only)"
      extra={
        <Input
          placeholder="Search by Card Number"
          value={searchCardNumber}
          onChange={(e) => setSearchCardNumber(e.target.value)}
          style={{ width: 250 }}
        />
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
        pagination={false}
        rowKey="cardno"
        bordered
        size="middle"
      />
    </Card>
  );
};

export default AssignPatient;
