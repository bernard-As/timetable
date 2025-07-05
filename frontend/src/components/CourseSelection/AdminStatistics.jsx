import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Row,
  Col,
  Statistic,
  Typography,
  Tag,
  Progress,
  Select,
  DatePicker,
  Space,
  Button,
  Input,
  Tooltip,
  Alert,
  Divider
} from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data - replace with API calls
  const [statistics, setStatistics] = useState({
    totalStudents: 245,
    totalRegistrations: 678,
    averageCoursesPerStudent: 2.8,
    completionRate: 87.5
  });

  const [courseStats, setCourseStats] = useState([
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Computer Science',
      enrollments: 145,
      capacity: 200,
      waitlist: 12,
      status: 'active',
      popularity: 72.5
    },
    {
      id: 2,
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      enrollments: 189,
      capacity: 180,
      waitlist: 25,
      status: 'full',
      popularity: 105.0
    },
    {
      id: 3,
      code: 'MATH101',
      name: 'Calculus I',
      enrollments: 167,
      capacity: 150,
      waitlist: 18,
      status: 'full',
      popularity: 111.3
    },
    {
      id: 4,
      code: 'CS301',
      name: 'Database Systems',
      enrollments: 98,
      capacity: 120,
      waitlist: 5,
      status: 'active',
      popularity: 81.7
    },
    {
      id: 5,
      code: 'PHYS101',
      name: 'Physics Fundamentals',
      enrollments: 45,
      capacity: 100,
      waitlist: 0,
      status: 'active',
      popularity: 45.0
    },
    {
      id: 6,
      code: 'ENG101',
      name: 'Technical Writing',
      enrollments: 78,
      capacity: 80,
      waitlist: 3,
      status: 'active',
      popularity: 97.5
    }
  ]);

  const [studentRegistrations, setStudentRegistrations] = useState([
    {
      id: 1,
      studentNumber: '2023001',
      studentName: 'John Smith',
      coursesSelected: ['CS101', 'MATH101'],
      registrationDate: '2024-06-15',
      status: 'confirmed'
    },
    {
      id: 2,
      studentNumber: '2023002',
      studentName: 'Sarah Johnson',
      coursesSelected: ['CS201', 'CS301', 'ENG101'],
      registrationDate: '2024-06-14',
      status: 'confirmed'
    },
    {
      id: 3,
      studentNumber: '2023003',
      studentName: 'Mike Davis',
      coursesSelected: ['PHYS101'],
      registrationDate: '2024-06-16',
      status: 'pending'
    },
    {
      id: 4,
      studentNumber: '2023004',
      studentName: 'Emily Wilson',
      coursesSelected: ['CS101', 'CS201'],
      registrationDate: '2024-06-13',
      status: 'confirmed'
    }
  ]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh data here
    } catch (error) {
      console.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'full': return 'red';
      case 'active': return 'green';
      case 'inactive': return 'gray';
      default: return 'blue';
    }
  };

  const getRegistrationStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'blue';
    }
  };

  const filteredCourseStats = courseStats.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const courseColumns = [
    {
      title: 'Course',
      key: 'course',
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.code}</Tag>
          <br />
          <Text style={{ fontSize: '0.9em' }}>{record.name}</Text>
        </div>
      )
    },
    {
      title: 'Enrollments',
      key: 'enrollments',
      sorter: (a, b) => a.enrollments - b.enrollments,
      render: (_, record) => (
        <div>
          <Text strong>{record.enrollments}</Text>
          <Text type="secondary"> / {record.capacity}</Text>
          <br />
          <Progress 
            percent={Math.round((record.enrollments / record.capacity) * 100)} 
            size="small"
            status={record.enrollments >= record.capacity ? 'exception' : 'active'}
          />
        </div>
      )
    },
    {
      title: 'Waitlist',
      dataIndex: 'waitlist',
      key: 'waitlist',
      sorter: (a, b) => a.waitlist - b.waitlist,
      render: (waitlist) => (
        <Tag color={waitlist > 0 ? 'orange' : 'green'}>
          {waitlist}
        </Tag>
      )
    },
    {
      title: 'Popularity',
      key: 'popularity',
      sorter: (a, b) => a.popularity - b.popularity,
      render: (_, record) => (
        <div>
          <Text>{record.popularity.toFixed(1)}%</Text>
          <br />
          <Progress 
            percent={Math.min(record.popularity, 100)} 
            size="small"
            strokeColor={record.popularity > 100 ? '#ff4d4f' : '#52c41a'}
          />
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Full', value: 'full' },
        { text: 'Inactive', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  const studentColumns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <Text strong>{record.studentName}</Text>
          <br />
          <Text type="secondary">{record.studentNumber}</Text>
        </div>
      )
    },
    {
      title: 'Courses Selected',
      key: 'courses',
      render: (_, record) => (
        <Space wrap>
          {record.coursesSelected.map(course => (
            <Tag key={course} color="blue">{course}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Course Count',
      key: 'courseCount',
      sorter: (a, b) => a.coursesSelected.length - b.coursesSelected.length,
      render: (_, record) => (
        <Tag color="purple">{record.coursesSelected.length}</Tag>
      )
    },
    {
      title: 'Registration Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      sorter: (a, b) => new Date(a.registrationDate) - new Date(b.registrationDate)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getRegistrationStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          <BarChartOutlined /> Course Selection Statistics
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '32px' }}>
          Analyze student course selections and enrollment patterns
        </Text>

        {/* Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="full">Full</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space style={{ width: '100%' }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Overall Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="Total Students"
                value={statistics.totalStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="Total Registrations"
                value={statistics.totalRegistrations}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="Avg. Courses/Student"
                value={statistics.averageCoursesPerStudent}
                precision={1}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="Completion Rate"
                value={statistics.completionRate}
                suffix="%"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Popular Courses Alert */}
        <Alert
          message="Course Capacity Alerts"
          description={
            <div>
              <Text>
                <InfoCircleOutlined /> {courseStats.filter(c => c.status === 'full').length} courses are at full capacity.
                {courseStats.filter(c => c.waitlist > 0).length > 0 && 
                  ` ${courseStats.filter(c => c.waitlist > 0).length} courses have waitlists.`
                }
              </Text>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Divider />

        {/* Course Statistics Table */}
        <Title level={3} style={{ marginBottom: '16px' }}>
          Course Enrollment Statistics
        </Title>
        <Table
          columns={courseColumns}
          dataSource={filteredCourseStats}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`
          }}
          scroll={{ x: 900 }}
          style={{ marginBottom: '32px' }}
        />

        <Divider />

        {/* Student Registrations Table */}
        <Title level={3} style={{ marginBottom: '16px' }}>
          Recent Student Registrations
        </Title>
        <Table
          columns={studentColumns}
          dataSource={studentRegistrations}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} registrations`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default AdminStatistics;