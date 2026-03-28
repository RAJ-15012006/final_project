import React, { useState, useEffect } from 'react';
import { Badge, Button, Typography, Space } from 'antd';
import { ThunderboltOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export default function GamingNotification() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show notification after 10 seconds on the dashboard
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '30px', 
      right: '30px', 
      zIndex: 5000,
      animation: 'slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      <div className="neon-card" style={{ 
        padding: '20px', 
        width: '320px', 
        background: 'rgba(10, 10, 20, 0.95)', 
        border: '2px solid var(--neon-cyan)',
        boxShadow: '0 0 30px rgba(0, 242, 255, 0.2)'
      }}>
        <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setVisible(false)}
            style={{ position: 'absolute', right: '10px', top: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}
        />
        
        <Space size={12}>
            <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'rgba(0, 242, 255, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid var(--neon-cyan)'
            }}>
                <ThunderboltOutlined className="flicker-text" style={{ color: 'var(--neon-cyan)', fontSize: '20px' }} />
            </div>
            <div>
                <Text style={{ display: 'block', color: '#fff', fontWeight: 'bold' }}>CODING ROOM ACTIVE</Text>
                <Text style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    Someone is waiting in the Coding Room. Join now!
                </Text>
            </div>
        </Space>

        <Button 
            className="neon-button" 
            block 
            style={{ marginTop: '16px', height: '40px' }}
            onClick={() => {
                navigate('/coding-room');
                setVisible(false);
            }}
        >
            JOIN NOW
        </Button>

        <div style={{ 
            position: 'absolute', 
            top: '0px', 
            left: '0px', 
            width: '4px', 
            height: '100%', 
            background: 'var(--neon-cyan)',
            boxShadow: '0 0 10px var(--neon-cyan)'
        }}></div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
