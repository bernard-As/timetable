import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Modal,
  Space,
  message,
  Typography,
  Tag,
  Popconfirm,
  Row,
  Col,
  Switch,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  SettingOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { PrivateDefaultApi } from '../../utils/AxiosInstance';
import { observer } from 'mobx-react';
import rootStore from '../../mobx';

const { Title, Text } = Typography;

const AdminPanel = observer(() => {
  const [courses, setCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Sample initial data - replace with API call
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await PrivateDefaultApi.get('/courses-selection-admin/');
        setCourses(response.data);
      } catch (error) {
        message.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
   

  const handleToggleStatus = async (courseId, isActive) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await PrivateDefaultApi.post('/courses-selection-admin/', {
        courseId,
        isActive
      });

      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, isActive } : course
      ));
      message.success(`Course ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      message.error('Failed to update course status');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingCourse) {
        // Update existing course
        setCourses(courses.map(course => 
          course.id === editingCourse.id 
            ? { ...course, ...values }
            : course
        ));
        message.success('Course updated successfully');
      } else {
        // Add new course
        const newCourse = {
          id: Math.max(...courses.map(c => c.id)) + 1,
          ...values,
          isActive: true
        };
        setCourses([...courses, newCourse]);
        message.success('Course added successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCourse(null);
    } catch (error) {
      message.error('Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchText.toLowerCase()) ||
    course.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          loading={loading}
        />
      )
    },
  ];

  const activeCourseCount = courses.filter(course => course.isActive).length;
  const totalCourseCount = courses.length;
  if(rootStore.credential !== 'SYSADM'){
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>
            Access Denied
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
            You do not have permission to access this page.
          </Text>
        </Card>
      </div>
    );
  }
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          <SettingOutlined /> Summer School Admin Panel
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '32px' }}>
          Manage courses available for student selection
        </Text>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Text type="secondary">Total Courses</Text>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {totalCourseCount}
              </Title>
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Text type="secondary">Active Courses</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {activeCourseCount}
              </Title>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Text type="secondary">Inactive Courses</Text>
              <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                {totalCourseCount - activeCourseCount}
              </Title>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          {/* <Col xs={24} sm={12} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCourse}
              style={{ width: '100%' }}
            >
              Add New Course
            </Button>
          </Col> */}
        </Row>

        {/* Course Table */}
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredCourses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`
          }}
          scroll={{ x: 800 }}
        />

        {/* Add/Edit Modal
        <Modal
          title={editingCourse ? 'Edit Course' : 'Add New Course'}
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleModalSubmit}
            requiredMark={false}
          >
            <Form.Item
              label="Course Code"
              name="code"
              rules={[
                { required: true, message: 'Please enter course code' },
                { pattern: /^[A-Z]+\d+$/, message: 'Course code must be in format like CS101' }
              ]}
            >
              <Input placeholder="e.g., CS101" />
            </Form.Item>

            <Form.Item
              label="Course Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter course name' },
                { min: 3, message: 'Course name must be at least 3 characters' }
              ]}
            >
              <Input placeholder="e.g., Introduction to Computer Science" />
            </Form.Item>

            {editingCourse && (
              <Form.Item
                label="Status"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </Form.Item>
            )}

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal> */}
      </Card>
    </div>
  );
});

export default AdminPanel;