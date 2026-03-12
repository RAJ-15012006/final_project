import React, { useState } from 'react';
import { Typography, Card, Table, Tag, Button, Input, Select, Space } from 'antd';
import { 
  CheckCircleOutlined,
  ContainerOutlined,
  AppstoreAddOutlined,
  FontSizeOutlined,
  TableOutlined,
  CalculatorOutlined,
  ThunderboltOutlined,
  SortAscendingOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { problems } from '../data/problems';

const { Title, Text } = Typography;
const { Search } = Input;

export default function Problems() {
  const { isSolved } = useProgress();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const TOPICS = [
    { name: 'All Topics', icon: <ContainerOutlined style={{ color: 'inherit' }} /> },
    { name: 'Array', icon: <AppstoreAddOutlined style={{ color: '#00f2ff' }} /> },
    { name: 'String', icon: <FontSizeOutlined style={{ color: '#bc13fe' }} /> },
    { name: 'Hash Table', icon: <TableOutlined style={{ color: '#00ff88' }} /> },
    { name: 'Math', icon: <CalculatorOutlined style={{ color: '#fadb14' }} /> },
    { name: 'Dynamic Programming', icon: <ThunderboltOutlined style={{ color: '#ff4d4f' }} /> },
    { name: 'Sorting', icon: <SortAscendingOutlined style={{ color: '#1890ff' }} /> },
    { name: 'Two Pointers', icon: <SwapOutlined style={{ color: '#eb2f96' }} /> },
  ];

  const columns = [
    {
      title: 'Status',
      dataIndex: 'id',
      key: 'status',
      width: 80,
      render: (id) => (
        isSolved(id) ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} /> : null
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/problem/${record.id}`)}
          style={{ padding: 0, fontWeight: 500, fontSize: '15px' }}
        >
          {record.id}. {text}
        </Button>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 120,
      render: (difficulty) => {
        let color = 'green';
        if (difficulty === 'Medium') color = 'orange';
        if (difficulty === 'Hard') color = 'red';
        return <Tag color={color}>{difficulty}</Tag>;
      },
    },
    {
      title: 'Topics',
      dataIndex: 'topics',
      key: 'topics',
      render: (topics) => (
        <>
          {topics.slice(0, 3).map(topic => (
            <Tag key={topic} style={{ borderRadius: '4px' }}>{topic}</Tag>
          ))}
          {topics.length > 3 && <Tag>+{topics.length - 3}</Tag>}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => {
        let btnColor = 'var(--neon-purple)'; // Default unresolved text color
        let backgroundStyle = 'rgba(188, 19, 254, 0.1)'; // Purple blur effect
        let borderStyle = 'rgba(188, 19, 254, 0.3)';
        let boxShadowStyle = 'none';
        
        if (isSolved(record.id)) {
           // Color based on difficulty when solved
           if (record.difficulty === 'Easy') btnColor = 'green';
           else if (record.difficulty === 'Medium') btnColor = 'orange';
           else if (record.difficulty === 'Hard') btnColor = 'red';
           
           backgroundStyle = 'transparent';
           borderStyle = btnColor;
           boxShadowStyle = 'none';
        }

        return (
          <Button
            type="default"
            style={{ 
              background: backgroundStyle, 
              borderColor: borderStyle,
              color: btnColor,
              boxShadow: boxShadowStyle,
              backdropFilter: isSolved(record.id) ? 'none' : 'blur(4px)'
            }}
            onClick={() => navigate(`/problem/${record.id}`)}
            size="small"
          >
            {isSolved(record.id) ? 'Practice' : 'Solve'}
          </Button>
        );
      },
    },
  ];

  const filteredProblems = problems.filter(prob => {
    const matchesSearch = prob.title.toLowerCase().includes(searchText.toLowerCase()) ||
      prob.id.toString() === searchText;
    const matchesDifficulty = difficultyFilter === 'All' || prob.difficulty === difficultyFilter;
    const matchesTopic = selectedTopic === 'All Topics' || prob.topics.includes(selectedTopic);
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  return (
    <div style={{ padding: '0 24px 40px 24px', color: '#fff' }}>
      <div style={{ marginBottom: '40px', position: 'relative' }}>
        <Title level={4} style={{ 
          margin: 0, 
          fontSize: '32px', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #bc13fe 0%, #7d00ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'absolute',
          top: '-70px',
          left: '0'
        }}>
          Problem Set
        </Title>
        <div className="glowing-underline" style={{ width: '150px', marginTop: '10px', background: 'var(--neon-purple)', position: 'absolute', top: '-25px', left: '0' }}></div>
      </div>
      
      <div className="glass-card" style={{ padding: '30px', border: '1px solid rgba(188, 19, 254, 0.2)' }}>
        <Space style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Search
            placeholder="Search problems..."
            onSearch={setSearchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 350 }}
            size="large"
            className="futuristic-input"
          />
          <Space>
            <Select
              defaultValue="Language"
              style={{ width: 150 }}
              size="large"
              options={[
                { value: 'Language', label: 'Language' },
                { value: 'C++', label: 'C++' },
                { value: 'Java', label: 'Java' },
                { value: 'Python', label: 'Python' },
                { value: 'Python3', label: 'Python3' },
                { value: 'C', label: 'C' },
                { value: 'C#', label: 'C#' },
                { value: 'JavaScript', label: 'JavaScript' },
                { value: 'TypeScript', label: 'TypeScript' },
                { value: 'PHP', label: 'PHP' },
                { value: 'Swift', label: 'Swift' },
                { value: 'Kotlin', label: 'Kotlin' },
                { value: 'Dart', label: 'Dart' },
                { value: 'Go', label: 'Go' },
                { value: 'Ruby', label: 'Ruby' },
                { value: 'Scala', label: 'Scala' },
                { value: 'Rust', label: 'Rust' },
                { value: 'Racket', label: 'Racket' },
                { value: 'Erlang', label: 'Erlang' },
                { value: 'Elixir', label: 'Elixir' },
                { value: 'Bash', label: 'Bash' },
              ]}
            />
            <Select
              defaultValue="All"
              style={{ width: 150 }}
              size="large"
              onChange={setDifficultyFilter}
              options={[
                { value: 'All', label: 'All' },
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' },
              ]}
            />
          </Space>
        </Space>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '30px', 
          overflowX: 'auto',
          paddingBottom: '8px',
          whiteSpace: 'nowrap'
        }} className="topics-scrollbar">
          {TOPICS.map(topic => {
            const isSelected = selectedTopic === topic.name;
            const iconStyle = { ...topic.icon.props.style };
            if (isSelected) iconStyle.color = '#000';
            
            return (
              <Button
                key={topic.name}
                type="text"
                onClick={() => setSelectedTopic(topic.name)}
                style={{
                  background: isSelected ? '#fff' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#000' : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '20px',
                  padding: '4px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  fontWeight: isSelected ? '600' : '400',
                  transition: 'all 0.3s'
                }}
              >
                {React.cloneElement(topic.icon, { style: iconStyle })}
                {topic.name}
              </Button>
            );
          })}
        </div>

        <Table
          columns={columns}
          dataSource={filteredProblems}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            style: { color: '#fff' }
          }}
          className="futuristic-table"
          style={{ background: 'transparent' }}
        />
      </div>

      <style>{`
        .futuristic-table .ant-table {
          background: transparent !important;
          color: #fff !important;
        }
        .futuristic-table .ant-table-thead > tr > th {
          background: rgba(188, 19, 254, 0.05) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          border-bottom: 1px solid rgba(188, 19, 254, 0.1) !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 11px;
        }
        .futuristic-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          background: transparent !important;
          color: #fff !important;
        }
        .futuristic-table .ant-table-tbody > tr:hover > td {
          background: rgba(188, 19, 254, 0.03) !important;
        }
        .ant-pagination-item a {
          color: rgba(255,255,255,0.6) !important;
        }
        .ant-pagination-item-active {
          border-color: var(--neon-purple) !important;
          background: rgba(188, 19, 254, 0.1) !important;
        }
        .ant-pagination-item-active a {
          color: var(--neon-purple) !important;
        }
        .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(188, 19, 254, 0.2) !important;
          color: #fff !important;
        }
        .ant-input {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(188, 19, 254, 0.2) !important;
          color: #fff !important;
        }
        .topics-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .topics-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .topics-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .topics-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
