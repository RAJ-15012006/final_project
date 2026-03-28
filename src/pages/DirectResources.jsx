import React, { useEffect } from 'react';
import { Typography, Row, Col, Button, Card } from 'antd';
import { 
  ArrowLeftOutlined, 
  BookOutlined, 
  CodeOutlined, 
  ThunderboltOutlined,
  DashboardOutlined,
  SettingOutlined,
  EyeOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import HandpickedNotesBG from '../assets/handpicked_notes_bg.png';

const { Title, Text } = Typography;

const RESOURCE_CARDS = [
  {
    title: 'DSA Cheat Sheets',
    description: 'Quick algorithm and data structure reference guides.',
    icon: <BookOutlined style={{ fontSize: '32px', color: '#bc13fe' }} />,
    color: '#bc13fe'
  },
  {
    title: 'Coding Practice Platforms',
    description: 'Direct links to popular competitive programming websites.',
    icon: <CodeOutlined style={{ fontSize: '32px', color: '#bc13fe' }} />,
    color: '#bc13fe'
  },
  {
    title: 'Interview Preparation Guides',
    description: 'Resources for coding interviews and problem solving.',
    icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#bc13fe' }} />,
    color: '#bc13fe'
  },
  {
    title: 'Algorithm Visualizers',
    description: 'Interactive tools to visualize algorithms and data structures.',
    icon: <EyeOutlined style={{ fontSize: '32px', color: '#bc13fe' }} />,
    color: '#bc13fe'
  },
  {
    title: 'System Design Resources',
    description: 'Learn scalable architecture and system design basics.',
    icon: <DashboardOutlined style={{ fontSize: '32px', color: '#bc13fe' }} />,
    color: '#bc13fe'
  },
  {
    title: 'Developer Tools',
    description: 'Useful compilers, debuggers, and coding utilities.',
    icon: <AppstoreOutlined style={{ fontSize: '32px', color: '#bc13fe' }} />,
    color: '#bc13fe'
  }
];

export default function DirectResources() {
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.8)), url(${HandpickedNotesBG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff',
      padding: '60px 20px',
      position: 'relative',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background Decorative Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '0%',
        width: '900px',
        height: '900px',
        background: 'radial-gradient(circle, rgba(188, 19, 254, 0.15) 0%, transparent 70%)',
        filter: 'blur(150px)',
        zIndex: 0
      }} />

      {/* Header / Nav */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '60px',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto 40px auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Logo size={40} />
          <Title level={4} style={{ margin: 0, color: '#fff', letterSpacing: '2px', fontWeight: '900', fontFamily: "'JetBrains Mono', monospace" }}>JARVIS</Title>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <Button type="text" style={{ color: '#fff', padding: '0 15px' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          <Button type="text" style={{ color: '#fff', fontSize: '13px', padding: '0 15px' }} onClick={() => navigate('/premium-notes')}>Go Back</Button>
        </div>
      </div>

      {/* Main Container with Green Glow Border */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'transparent',
        padding: '20px 0',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={1} style={{ 
            fontSize: '52px', 
            fontWeight: '950', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            margin: '0 0 10px 0',
            background: 'linear-gradient(90deg, #fff, #bc13fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(188, 19, 254, 0.5)'
          }}>
            DIRECT LINKS ON HANDPICKED NOTES
          </Title>
          <Text style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '18px', 
            fontWeight: '500' 
          }}>
            Quick access to essential coding tools, platforms, and developer resources.
          </Text>
        </div>

        {/* Resource Grid with balanced gutter */}
        <Row gutter={[32, 64]}>
          {RESOURCE_CARDS.map((item, idx) => (
            <Col xs={24} md={12} lg={8} key={idx}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(188, 19, 254, 0.15)',
                padding: '30px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }} className="resource-card">
                <div style={{ marginBottom: '20px' }}>
                  {item.icon}
                </div>
                <Title level={4} style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '20px', fontWeight: '700' }}>
                  {item.title}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>
                  {item.description}
                </Text>
                <Button 
                  type="primary" 
                  shape="round"
                  style={{
                  background: 'linear-gradient(90deg, #9b00e3, #d600d6)',
                  border: 'none',
                  height: '44px',
                  padding: '0 40px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '900',
                  fontSize: '14px',
                  boxShadow: '0 0 10px rgba(188, 19, 254, 0.2)'
                  }}
                  className="open-resource-btn"
                >
                  Open Resource
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <style>{`
        .resource-card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(188, 19, 254, 0.6) !important;
          box-shadow: 0 15px 40px rgba(188, 19, 254, 0.3) !important;
          background: rgba(188, 19, 254, 0.08) !important;
        }
        .open-resource-btn:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
          box-shadow: 0 0 25px rgba(255, 0, 255, 0.6);
        }
      `}</style>
    </div>
  );
}
