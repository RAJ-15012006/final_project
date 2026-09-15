import React from 'react';
import { Typography, Button, Space, Row, Col, Avatar } from 'antd';
import { 
  ArrowLeftOutlined, 
  ThunderboltOutlined,
  CommentOutlined,
  BulbOutlined,
  LineChartOutlined,
  StarOutlined,
  RobotOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import InterviewBG from '../assets/interview_simulator_bg.png';

const { Title, Text } = Typography;

const FEATURES = [
  {
    icon: <CommentOutlined />,
    title: 'Real interviewer-style cross questioning',
    description: 'Engage in dynamic dialogues that test reasoning and depth.',
    color: '#00f2ff'
  },
  {
    icon: <BulbOutlined />,
    title: 'Smart prompts like "Why this approach?" and "Optimize further"',
    description: 'AI challenges decisions for critical refinement.',
    color: '#bc13fe'
  },
  {
    icon: <LineChartOutlined />,
    title: 'Live difficulty adjustment based on user performance',
    description: 'Adaptive questioning that matches your skill level.',
    color: '#00ff88'
  },
  {
    icon: <StarOutlined />,
    title: 'Post-interview rating and feedback system',
    description: 'Receive detailed scores and actionable insights.',
    color: '#fadb14'
  }
];

export default function InterviewSimulator() {
  const navigate = useNavigate();
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url(${InterviewBG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff',
      padding: '40px',
      position: 'relative',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      {/* Background Decorative Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '0%',
        width: '900px',
        height: '900px',
        background: 'radial-gradient(circle, rgba(0, 242, 255, 0.12) 0%, transparent 70%)',
        filter: 'blur(150px)',
        zIndex: 0,
        animation: 'pulse 15s infinite alternate'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(188, 19, 254, 0.15) 0%, transparent 70%)',
        filter: 'blur(120px)',
        zIndex: 0,
        animation: 'pulse 12s infinite alternate-reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 242, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: 0,
        animation: 'pulse 10s infinite alternate'
      }} />

      {/* Header / Nav */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '60px',
        position: 'relative',
        zIndex: 10,
        width: '100%',
        margin: '0 0 40px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Logo size={40} />
          <Title level={4} style={{ margin: 0, color: '#fff', letterSpacing: '2px', fontWeight: '900', fontFamily: "'JetBrains Mono', monospace" }}>JARVIS</Title>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            style={{ color: '#fff', display: 'flex', alignItems: 'center', fontSize: '13px', padding: 0 }} 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            style={{ color: 'rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', fontSize: '13px', padding: 0 }} 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 10 
      }}>
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="glass-card" 
          style={{
            padding: '60px',
            borderRadius: '40px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Badge */}
          <div style={{
            background: 'linear-gradient(90deg, #00f2ff, #bc13fe)',
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '24px',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)'
          }}>
            <Text style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Game-Changing Feature</Text>
          </div>

          <Row gutter={[60, 40]} align="middle">
            <Col xs={24} lg={13}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '16px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: '#00f2ff'
                }}>
                  <RobotOutlined />
                </div>
                <div>
                  <Title level={1} style={{ 
                    color: '#fff', 
                    fontSize: '56px', 
                    fontWeight: '900', 
                    margin: 0,
                    letterSpacing: '-1px',
                    lineHeight: '1.1'
                  }}>
                    Interviewer Simulator
                  </Title>
                  <Text style={{ 
                    color: 'rgba(255, 255, 255, 0.5)', 
                    fontSize: '18px', 
                    fontWeight: '500',
                    display: 'block',
                    marginTop: '8px'
                  }}>
                    Real Chat-Based Mock Interviews powered by AI
                  </Text>
                </div>
              </div>

              <div style={{ marginTop: '48px' }}>
                <Space direction="vertical" size={32} style={{ width: '100%' }}>
                  {FEATURES.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        fontSize: '24px', 
                        color: feature.color, 
                        marginTop: '4px',
                        background: `${feature.color}15`,
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${feature.color}30`,
                        flexShrink: 0
                      }}>
                        {feature.icon}
                      </div>
                      <div>
                        <Text style={{ color: '#fff', fontSize: '18px', fontWeight: '700', display: 'block' }}>{feature.title}</Text>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', marginTop: '4px', display: 'block' }}>{feature.description}</Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </div>
            </Col>

            <Col xs={24} lg={11}>
              {/* Chat Preview */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '24px',
                border: '1px solid rgba(0, 242, 255, 0.2)',
                padding: '30px',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 30px rgba(0, 242, 255, 0.1)'
              }}>
                {/* Demo Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: 'rgba(0, 242, 255, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 242, 255, 0.3)'
                    }}>
                      <RobotOutlined style={{ color: '#00f2ff' }} />
                    </div>
                    <Text style={{ color: '#00f2ff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Premium AI Interviewer</Text>
                  </div>
                  <div style={{
                    background: 'rgba(188, 19, 254, 0.15)',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(188, 19, 254, 0.3)'
                  }}>
                    <Text style={{ color: '#bc13fe', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>Sample Interaction</Text>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: 0.8 }}>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    padding: '16px 20px', 
                    borderRadius: '16px 16px 16px 4px',
                    maxWidth: '85%',
                    alignSelf: 'flex-start',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Could you explain your approach to handling concurrency?</Text>
                  </div>

                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(188, 19, 254, 0.3), rgba(0, 242, 255, 0.3))', 
                    padding: '16px 20px', 
                    borderRadius: '16px 16px 4px 16px',
                    maxWidth: '85%',
                    alignSelf: 'flex-end',
                    border: '1px solid rgba(188, 19, 254, 0.2)',
                    textAlign: 'right'
                  }}>
                    <Text style={{ color: '#fff', fontSize: '14px' }}>Sure, I would use...</Text>
                  </div>

                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    padding: '16px 20px', 
                    borderRadius: '16px 16px 16px 4px',
                    maxWidth: '85%',
                    alignSelf: 'flex-start',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Why this approach? <span style={{ fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.8)' }}>What are the pros/cons?</span></Text>
                  </div>
                </div>

                {/* Premium Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: '40px',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '15px 25px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}>
                    <ThunderboltOutlined style={{ color: '#bc13fe', fontSize: '24px', marginBottom: '10px' }} />
                    <Title level={5} style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '14px' }}>Premium AI Feature</Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', display: 'block' }}>Real-time voice and chat interviews</Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Start Button */}
          <div style={{ 
            marginTop: '60px', 
            textAlign: 'center' 
          }}>
            <Button 
              type="primary" 
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/mock-interview')}
              style={{
                height: '64px',
                padding: '0 48px',
                borderRadius: '32px',
                background: 'linear-gradient(90deg, #00f2ff, #bc13fe)',
                border: 'none',
                fontSize: '20px',
                fontWeight: '900',
                display: 'inline-flex',
                alignItems: 'center',
                flexDirection: 'row-reverse',
                gap: '12px',
                boxShadow: '0 15px 30px rgba(188, 19, 254, 0.3)',
                transition: 'all 0.3s'
              }}
              className="start-interview-btn"
            >
              Start Mock Interview
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.1); opacity: 0.7; }
        }
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.06), transparent 40%);
          z-index: 0;
          pointer-events: none;
        }
        .start-interview-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(188, 19, 254, 0.4) !important;
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}
