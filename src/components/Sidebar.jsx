import React from 'react';
import { Layout, Menu, Typography, Space, Button } from 'antd';
import {
  HomeOutlined,
  BlockOutlined,
  BulbOutlined,
  CodeOutlined,
  UserOutlined,
  LogoutOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;
const { Text, Title } = Typography;

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined style={{ fontSize: '20px', color: '#00f2ff', filter: 'drop-shadow(0 0 8px rgba(0, 242, 255, 0.4))' }} />,
      label: 'Dashboard',
    },
    {
      key: '/problems',
      icon: <BlockOutlined style={{ fontSize: '20px', color: '#00ff88', filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))' }} />,
      label: 'Problems',
    },
    {
      key: '/coding-room',
      icon: <RocketOutlined style={{ fontSize: '20px', color: '#bc13fe', filter: 'drop-shadow(0 0 8px rgba(188, 19, 254, 0.4))' }} />,
      label: 'Coding Room',
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={260}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ 
        padding: '30px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        marginBottom: '20px'
      }}>
        {!collapsed && (
          <Title level={4} style={{ 
            margin: 0, 
            paddingLeft: '80px',
            textAlign: 'left',
            fontSize: '18px', 
            fontWeight: '900',
            letterSpacing: '1px',
            background: 'linear-gradient(135deg, #00f2ff 0%, #bc13fe 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(0, 242, 255, 0.2)'
          }}>
            JARVIS
          </Title>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          background: 'transparent', 
          border: 'none',
          padding: '0 10px'
        }}
        items={menuItems.map(item => ({
          ...item,
          label: !collapsed && (
            <span style={{ 
              fontWeight: location.pathname === item.key ? '700' : '400',
              letterSpacing: '0.5px'
            }}>
              {item.label}
            </span>
          ),
          style: {
            borderRadius: '12px',
            marginBottom: '8px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            color: location.pathname === item.key ? '#fff' : 'rgba(255,255,255,0.4)',
            background: location.pathname === item.key ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
            border: location.pathname === item.key ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid transparent',
          }
        }))}
        onClick={({ key }) => navigate(key)}
      />


      <style>{`
        .futuristic-menu .ant-menu-item {
          border-radius: 12px !important;
          margin-bottom: 8px !important;
          transition: all 0.3s !important;
          height: 46px !important;
          line-height: 46px !important;
        }
        .futuristic-menu .ant-menu-item-selected {
          background: rgba(0, 242, 255, 0.1) !important;
          color: var(--neon-cyan) !important;
          box-shadow: inset 0 0 10px rgba(0, 242, 255, 0.1);
          border-left: 3px solid var(--neon-cyan);
        }
        .futuristic-menu .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: var(--neon-cyan) !important;
        }
        .futuristic-menu .ant-menu-item .anticon {
          font-size: 18px !important;
        }
        .ant-menu-item:hover .anticon {
          transform: scale(1.2);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: brightness(1.2) drop-shadow(0 0 12px currentColor) !important;
        }
      `}</style>
    </Sider>
  );
}
