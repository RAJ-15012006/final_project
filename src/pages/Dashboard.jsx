import React, { useMemo, useState } from 'react';
import { Typography, Row, Col, List, Avatar, Space, Button, Progress, Card } from 'antd';
import { 
  TrophyOutlined, 
  ThunderboltOutlined, 
  FireOutlined, 
  CheckCircleOutlined,
  RiseOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { problems } from '../data/problems';
import GamingNotification from '../components/GamingRoom/GamingNotification';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// Helper to calculate topic progress
const calculateTopicProgress = (solvedIds) => {
  const topicStats = {};
  
  problems.forEach(p => {
    p.topics.forEach(t => {
      if (!topicStats[t]) {
        topicStats[t] = { total: 0, solved: 0 };
      }
      topicStats[t].total += 1;
      if (solvedIds.includes(p.id)) {
        topicStats[t].solved += 1;
      }
    });
  });

  return Object.keys(topicStats).map(name => {
    let color = '#bc13fe'; // Default Purple
    if (['Array', 'Math', 'Binary Search'].some(t => name.includes(t))) {
      color = '#00f2ff'; // Electric Cyan
    } else if (['Recursion', 'Dynamic Programming', 'DP', 'Backtracking'].some(t => name.includes(t))) {
      color = '#bc13fe'; // Vibrant Purple
    } else if (['String', 'Hash Table', 'Stack', 'Queue'].some(t => name.includes(t))) {
      color = '#ff00ff'; // Magenta
    }

    return {
      name,
      progress: Math.round((topicStats[name].solved / topicStats[name].total) * 100),
      count: topicStats[name].solved,
      total: topicStats[name].total,
      color
    };
  }).sort((a, b) => b.progress - a.progress)
     .slice(0, 16); // 16 floating nodes as requested
};

// Helper to calculate difficulty breakdown
const calculateDifficultyStats = (solvedIds) => {
  const stats = {
    Easy: { total: 0, solved: 0, color: '#00ff88' },
    Medium: { total: 0, solved: 0, color: '#fadb14' },
    Hard: { total: 0, solved: 0, color: '#ff4d4f' }
  };
  
  problems.forEach(p => {
    if (stats[p.difficulty]) {
        stats[p.difficulty].total += 1;
        if (solvedIds.includes(p.id)) {
            stats[p.difficulty].solved += 1;
        }
    }
  });

  return stats;
};

const LEADERBOARD_DATA = [
  { name: 'Shreevidya T S', solved: 142, rank: 1, avatar: 'S' },
  { name: 'Yashasvi', solved: 128, rank: 2, avatar: 'Y' },
  { name: 'Rahul Kumar', solved: 115, rank: 3, avatar: 'R' },
  { name: 'Sneha Kapoor', solved: 94, rank: 4, avatar: 'S' },
  { name: 'John Doe', solved: 88, rank: 5, avatar: 'J' },
  { name: 'Jane Smith', solved: 82, rank: 6, avatar: 'J' },
  { name: 'Amit Singh', solved: 75, rank: 7, avatar: 'A' },
  { name: 'Priya Sharma', solved: 68, rank: 8, avatar: 'P' },
  { name: 'Vikram Aditya', solved: 62, rank: 9, avatar: 'V' },
  { name: 'Riya Verma', solved: 55, rank: 10, avatar: 'R' },
  { name: 'Ananya Roy', solved: 48, rank: 11, avatar: 'A' },
  { name: 'Ishaan Gupta', solved: 42, rank: 12, avatar: 'I' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { totalSolvedCount, solvedProblems } = useProgress();
  const navigate = useNavigate();

  const dynamicTopics = useMemo(() => calculateTopicProgress(solvedProblems), [solvedProblems]);
  const difficultyStats = useMemo(() => calculateDifficultyStats(solvedProblems), [solvedProblems]);

  const sortedLeaderboard = useMemo(() => {
    // Incorporate current user into leaderboard
    const allUsers = [
      ...LEADERBOARD_DATA,
      { name: user?.name || 'You', solved: totalSolvedCount, rank: 0, avatar: user?.name?.[0] || 'U', isUser: true }
    ];
    return allUsers.sort((a, b) => b.solved - a.solved).slice(0, 10);
  }, [totalSolvedCount, user]);

  return (
    <div style={{ 
      padding: '0 20px 40px 20px', 
      color: '#fff',
      borderRadius: '20px'
    }}>
      <GamingNotification />
      {/* Welcome Section */}
      <div style={{ marginBottom: '60px' }}>
        <Title level={1} style={{ 
          margin: 0, 
          fontSize: '48px', 
          fontWeight: '900',
          background: 'linear-gradient(135deg, #00f2ff 0%, #bc13fe 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(0, 242, 255, 0.2)'
        }}>
          Welcome Back, Coder!
        </Title>
        <div className="glowing-underline" style={{ width: '400px', marginTop: '15px' }}></div>
      </div>


      <Row gutter={[40, 40]}>
        {/* Topic Progress Circular Graph (Center-Left) */}
        <Col xs={24} xl={17}>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', position: 'relative', minHeight: '700px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={4} style={{ 
              margin: 0, 
              marginBottom: '40px',
              fontSize: '16px', 
              fontWeight: '900',
              letterSpacing: '1px',
              background: 'linear-gradient(135deg, #00f2ff 0%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
            }}>Topic Proficiency</Title>
            
            <div style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto' }}>
              {/* Main Radial SVG */}
              <svg width="600" height="600" viewBox="0 0 600 600" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                   <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="#bc13fe" />
                  </linearGradient>
                </defs>
                {/* Background Ring - Segmented Ticks */}
                <circle 
                  cx="300" cy="300" r="260" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.03)" 
                  strokeWidth="24" 
                  strokeDasharray="2 6"
                />
                
                {/* Progress Ring - Segmented Ticks */}
                <circle 
                  cx="300" cy="300" r="260" 
                  fill="none" 
                  stroke="url(#ringGradient)" 
                  strokeWidth="24" 
                  strokeDasharray="2 6"
                  strokeDashoffset={1633 - (1633 * (totalSolvedCount / problems.length))}
                  style={{ 
                    transition: 'stroke-dashoffset 1s ease-in-out',
                    filter: 'drop-shadow(0 0 15px rgba(0, 242, 255, 0.4))'
                  }}
                />

                {/* Inner Glow Circle */}
              </svg>

              {/* Central Indicator - Solid Magenta Glow Circle */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '130px',
                height: '130px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '2px solid rgba(255, 0, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255, 0, 255, 0.1)',
                zIndex: 10,
              }}>
                <Text style={{ 
                  color: '#fff', 
                  fontSize: '42px', 
                  fontWeight: '900',
                  lineHeight: '1',
                }}>{totalSolvedCount}</Text>
                <Text style={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginTop: '4px'
                }}>SOLVED</Text>
              </div>

              {/* Topic Bubbles - Inside the circle */}
              {dynamicTopics.map((topic, i) => {
                const angle = (i * (360 / dynamicTopics.length)) * (Math.PI / 180);
                const radius = i % 2 === 0 ? 175 : 125;
                const x = 300 + radius * Math.cos(angle);
                const y = 300 + radius * Math.sin(angle);
                
                // Variable bubble size based on progress (0% still has a base size)
                const size = 55 + (topic.progress / 100) * 35;

                return (
                  <div key={topic.name} style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: `${size}px`,
                    height: `${size}px`,
                    background: 'rgba(20, 10, 35, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${topic.color}`,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${topic.color}44, inset 0 0 15px ${topic.color}22`,
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                  }}>
                    <Text style={{ 
                      color: '#fff', 
                      fontSize: `${12 + (size / 15)}px`, 
                      fontWeight: '800',
                      fontFamily: "'Inter', sans-serif" 
                    }}>{topic.progress}%</Text>
                    <Text style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: `${6 + (size / 30)}px`, 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      fontFamily: "'Inter', sans-serif",
                      textAlign: 'center',
                      padding: '0 5px',
                      fontWeight: '600'
                    }}>{topic.name.slice(0, 12)}</Text>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solved Questions Difficulty Breakdown */}
          <div className="glass-card" style={{ padding: '30px', marginTop: '30px' }}>
            <Title level={4} style={{ 
              margin: 0, 
              marginBottom: '30px',
              fontSize: '16px', 
              fontWeight: '900',
              letterSpacing: '1px',
              background: 'linear-gradient(135deg, #00ff88 0%, #fadb14 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
            }}>Solved Questions</Title>

            <Row gutter={40} align="middle">
              <Col span={10}>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={Math.round((totalSolvedCount / problems.length) * 100)}
                    strokeColor={{
                      '0%': '#00ff88',
                      '100%': '#3366ff',
                    }}
                    strokeWidth={8}
                    size={180}
                    format={() => null}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
                      {totalSolvedCount}<span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.3)' }}>/{problems.length}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>QUESTIONS</div>
                  </div>
                </div>
              </Col>
              
              <Col span={14}>
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                  {Object.entries(difficultyStats).map(([label, data]) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{label}</Text>
                        <Text style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                          {data.solved}<span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 'normal' }}>/{data.total}</span>
                        </Text>
                      </div>
                      <Progress 
                        percent={Math.round((data.solved / data.total) * 100)} 
                        strokeColor={data.color}
                        trailColor="rgba(255,255,255,0.05)"
                        showInfo={false}
                        strokeWidth={6}
                      />
                    </div>
                  ))}
                </Space>
              </Col>
            </Row>
          </div>

          {/* Streak Calendar Section - Just below Solved Questions */}
          <div style={{ marginTop: '30px' }}>
            <StreakCalendar />
          </div>
        </Col>

        {/* Right-Side Panel (Leaderboard & Premium) */}
        <Col xs={24} xl={7}>
          {/* Leaderboard Card - Matches Topic Proficiency height dynamically */}
          <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '700px', maxHeight: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <Title level={4} style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: '900',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #bc13fe 0%, #ff00ff 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
              }}>Leaderboard</Title>
              <TrophyOutlined style={{ color: 'var(--neon-purple)', fontSize: '24px', filter: 'drop-shadow(0 0 5px rgba(188, 19, 254, 0.5))' }} />
            </div>

            {/* Podium */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'center', 
              gap: '15px', 
              marginBottom: '40px',
              padding: '20px 0'
            }}>
              {/* Rank 2 - Cyan */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <Avatar size={50} src={null} style={{ background: 'rgba(0, 242, 255, 0.1)', border: '2px solid var(--neon-cyan)', marginBottom: '10px' }}>{sortedLeaderboard[1].avatar}</Avatar>
                <div style={{ 
                  height: '80px', 
                  background: 'linear-gradient(180deg, rgba(0, 242, 255, 0.15), transparent)', 
                  border: '1px solid var(--neon-cyan)',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(0, 242, 255, 0.1)'
                }}>
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>2</Text>
                </div>
                <Text style={{ display: 'block', fontSize: '11px', marginTop: '5px', color: sortedLeaderboard[1].isUser ? 'var(--neon-cyan)' : 'inherit' }}>{sortedLeaderboard[1].name.split(' ')[0]}</Text>
              </div>

              {/* Rank 1 - Magenta */}
              <div style={{ textAlign: 'center', flex: 1.2 }}>
                <Avatar size={70} src={null} style={{ background: '#cc00cc', border: '3px solid #fff', marginBottom: '10px', boxShadow: '0 0 20px rgba(204, 0, 204, 0.4)' }}>{sortedLeaderboard[0].avatar}</Avatar>
                <div style={{ 
                  height: '110px', 
                  background: 'linear-gradient(180deg, rgba(204, 0, 204, 0.15), transparent)', 
                  border: '1px solid #cc00cc',
                  borderRadius: '10px 10px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(204, 0, 204, 0.1)'
                }}>
                  <Text style={{ fontSize: '42px', fontWeight: 'bold', color: '#cc00cc' }}>1</Text>
                </div>
                <Text style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginTop: '5px', color: '#cc00cc' }}>{sortedLeaderboard[0].name.split(' ')[0]}</Text>
              </div>

              {/* Rank 3 - Purple */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <Avatar size={50} src={null} style={{ background: 'rgba(188, 19, 254, 0.1)', border: '2px solid var(--neon-purple)', marginBottom: '10px' }}>{sortedLeaderboard[2].avatar}</Avatar>
                <div style={{ 
                  height: '60px', 
                  background: 'linear-gradient(180deg, rgba(188, 19, 254, 0.15), transparent)', 
                  border: '1px solid var(--neon-purple)',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(188, 19, 254, 0.1)'
                }}>
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neon-purple)' }}>3</Text>
                </div>
                <Text style={{ display: 'block', fontSize: '11px', marginTop: '5px', color: sortedLeaderboard[2].isUser ? 'var(--neon-purple)' : 'inherit' }}>{sortedLeaderboard[2].name.split(' ')[0]}</Text>
              </div>
            </div>

            {/* Rest of the list */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                <List
                dataSource={sortedLeaderboard.slice(3)}
                renderItem={(item, index) => (
                    <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 15px', 
                    background: item.isUser ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.02)', 
                    borderRadius: '12px', 
                    marginBottom: '8px',
                    border: item.isUser ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s'
                    }}>
                    <Text style={{ width: '25px', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{index + 4}</Text>
                    <Avatar size={28} style={{ background: 'rgba(255,255,255,0.1)', marginRight: '12px' }}>{item.avatar}</Avatar>
                    <div style={{ flex: 1 }}>
                        <Text style={{ display: 'block', color: item.isUser ? 'var(--neon-cyan)' : '#fff', fontSize: '13px', fontWeight: item.isUser ? '700' : '400' }}>{item.name}</Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Text style={{ color: 'var(--neon-purple)', fontWeight: 'bold', display: 'block', fontSize: '13px' }}>{item.solved}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px', textTransform: 'uppercase' }}>Solved</Text>
                    </div>
                    </div>
                )}
                />
            </div>
          </div>

          {/* Premium Section - Align with Solved Questions margin */}
          <div style={{ marginTop: '30px' }}>
              <Title level={4} style={{ 
                margin: 0, 
                marginBottom: '20px',
                fontSize: '18px', 
                fontWeight: '900',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #00f2ff 0%, #bc13fe 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
              }}>
                Pro Coding Arena
              </Title>
              <div 
                  onClick={() => navigate('/coding-room')}
                  style={{ 
                    borderRadius: '16px',
                    padding: '30px 20px',
                    marginBottom: '40px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    boxShadow: '0 0 30px rgba(0, 242, 255, 0.1)',
                    border: '1px solid #00f2ff',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }} className="hover:scale-105 hover:shadow-cyan-lg">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00f2ff', boxShadow: '0 0 10px #00f2ff' }}></div>
                    <Text style={{ color: '#00f2ff', fontWeight: 'bold', fontSize: '10px', letterSpacing: '2px' }}>SYSTEM ONLINE // MISSION READY</Text>
                  </div>
                  <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: '900' }}>ENTER THE PRO ARENA</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Test your skills against elite coders in real-time battles.</Text>
                  <div style={{
                    position: 'absolute',
                    right: '25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '24px',
                    color: '#00f2ff',
                    opacity: 0.5
                  }}><RocketOutlined /></div>
              </div>

              <Title level={4} style={{ 
                margin: 0, 
                marginBottom: '20px',
                fontSize: '18px', 
                fontWeight: '900',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #ffcc00 0%, #ff6600 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
              }}>
                Premium Resources
              </Title>

              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {/* Links and Notes Card */}
                <div 
                  onClick={() => navigate('/premium-notes')}
                  style={{ 
                    borderRadius: '16px',
                    padding: '24px 20px',
                    background: 'linear-gradient(135deg, #00f2ff44 0%, #7d00ff44 100%)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 0 20px rgba(0, 242, 255, 0.1)',
                    border: '1px solid rgba(0, 242, 255, 0.2)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, boxShadow 0.2s'
                  }} className="hover:scale-105 hover:shadow-cyan">
                  <Text style={{ 
                    color: '#fff', 
                    fontSize: '18px', 
                    fontWeight: '800',
                    display: 'block',
                    marginBottom: '8px'
                  }}>Links and Notes</Text>
                  <Button type="primary" shape="round" style={{
                    background: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    border: 'none',
                    marginTop: '10px'
                  }}>Access Now</Button>
                  <div style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(0, 242, 255, 0.4) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                </div>


                {/* Interview Simulator Card */}
                <div 
                  onClick={() => navigate('/interview-simulator')}
                  style={{ 
                    borderRadius: '16px',
                    padding: '24px 20px',
                    background: 'linear-gradient(135deg, #00ff8844 0%, #00f2ff44 100%)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 0 20px rgba(0, 255, 136, 0.1)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, boxShadow 0.2s'
                  }} className="hover:scale-105 hover:shadow-green">
                  <Text style={{ 
                    color: '#fff', 
                    fontSize: '18px', 
                    fontWeight: '800',
                    display: 'block',
                    marginBottom: '8px'
                  }}>Interview Simulator</Text>
                  <Button type="primary" shape="round" style={{
                    background: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    border: 'none',
                    marginTop: '10px'
                  }}>Start Session</Button>
                  <div style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                </div>

              </Space>
            </div>
        </Col>
      </Row>
    </div>
  );
}

const StreakCalendar = () => {
  const { streak, longestStreak, activityMap } = useProgress();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const startDay = (firstDayOfMonth(currentMonth) + 6) % 7; // Align Monday as start
    const days = [];
    
    // Day labels
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    weekDays.forEach(day => {
      days.push(
        <div key={`label-${day}-${Math.random()}`} style={{ 
          textAlign: 'center', 
          color: 'rgba(255,255,255,0.2)', 
          fontSize: '14px',
          fontWeight: '500',
          padding: '10px 0'
        }}>{day}</div>
      );
    });

    // Blank spaces for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`blank-${i}`} />);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dateStr = date.toISOString().split('T')[0];
      const hasSolved = activityMap[dateStr];
      const isToday = dateStr === todayStr;

      days.push(
        <div key={dateStr} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '8px 0',
          position: 'relative'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            color: hasSolved ? '#000' : (isToday ? '#ffcc00' : 'rgba(255,255,255,0.5)'),
            background: hasSolved ? '#00ff88' : 'rgba(255,255,255,0.03)',
            border: isToday ? '2px solid #ffcc00' : 'none',
            boxShadow: hasSolved ? '0 0 15px rgba(0, 255, 136, 0.4)' : 'none',
            fontWeight: hasSolved || isToday ? 'bold' : 'normal',
            cursor: 'default',
            transition: 'all 0.3s'
          }}>
            {d}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <Row gutter={[40, 40]}>
        {/* Streak Stats Side */}
        <Col xs={24} md={8}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            {/* Learning Streak Card */}
            <div style={{ 
              padding: '25px', 
              background: 'rgba(0, 255, 136, 0.05)', 
              border: '1px solid rgba(0, 255, 136, 0.2)', 
              borderRadius: '20px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FireOutlined style={{ color: '#00ff88', fontSize: '20px' }} />
                <Text style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '15px' }}>Learning Streak!</Text>
              </div>
              <div>
                <span style={{ fontSize: '36px', fontWeight: '900', color: '#fff' }}>{streak}</span>
                <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', marginLeft: '10px' }}>Days</span>
              </div>
            </div>

            {/* Longest Streak Card */}
            <div style={{ 
              padding: '25px', 
              background: 'rgba(188, 19, 254, 0.05)', 
              border: '1px solid rgba(188, 19, 254, 0.2)', 
              borderRadius: '20px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <TrophyOutlined style={{ color: '#bc13fe', fontSize: '18px' }} />
                <Text style={{ color: '#bc13fe', fontWeight: 'bold', fontSize: '15px' }}>Longest Streak!</Text>
              </div>
              <div>
                <span style={{ fontSize: '36px', fontWeight: '900', color: '#fff' }}>{longestStreak}</span>
                <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', marginLeft: '10px' }}>Days</span>
              </div>
            </div>
          </Space>
        </Col>

        {/* Calendar Side */}
        <Col xs={24} md={16}>
          <div style={{ padding: '0 20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '30px' 
            }}>
              <Space size={10} align="start">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px' }}>Y</Text>
                  <Button 
                    type="text" 
                    icon={<RiseOutlined style={{ transform: 'rotate(-90deg)', opacity: 0.4 }} />} 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth()))} 
                    title="Previous Year"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px' }}>M</Text>
                  <Button 
                    type="text" 
                    icon={<RiseOutlined style={{ transform: 'rotate(-90deg)' }} />} 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} 
                    title="Previous Month"
                  />
                </div>
              </Space>
              
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ 
                  margin: 0, 
                  color: '#fff', 
                  fontSize: '24px', 
                  fontWeight: '700',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  {monthNames[currentMonth.getMonth()]}
                </Title>
                <Text style={{ 
                  color: 'var(--neon-cyan)', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  letterSpacing: '4px',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  {currentMonth.getFullYear()}
                </Text>
              </div>

              <Space size={10} align="start">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px' }}>M</Text>
                  <Button 
                    type="text" 
                    icon={<RiseOutlined style={{ transform: 'rotate(90deg)' }} />}
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} 
                    title="Next Month"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px' }}>Y</Text>
                  <Button 
                    type="text" 
                    icon={<RiseOutlined style={{ transform: 'rotate(90deg)', opacity: 0.4 }} />}
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth()))} 
                    title="Next Year"
                  />
                </div>
              </Space>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '10px' 
            }}>
              {renderDays()}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
