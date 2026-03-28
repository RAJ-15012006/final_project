import React from 'react';
import { Layout, Button, Avatar, Typography, Dropdown, Space, Tooltip } from 'antd';
import Sidebar from './Sidebar';
import { 
  MoreOutlined, UserOutlined, LogoutOutlined, SettingOutlined, 
  DownOutlined, BellOutlined, LeftSquareOutlined, BorderTopOutlined, 
  FullscreenOutlined, AppstoreOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardBG from '../assets/dashboard_bg2.jpg';
import { problems } from '../data/problems';

const { Content } = Layout;
const { Text } = Typography;

export default function MainLayout({ children, forceCollapse = false }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(forceCollapse);

  React.useEffect(() => {
    if (forceCollapse) {
        setCollapsed(true);
    }
  }, [forceCollapse]);
  
  const isDashboard = location.pathname === '/dashboard';
  const isProblemPage = location.pathname.startsWith('/problem/');
  const problemId = isProblemPage ? location.pathname.split('/')[2] : null;
  const problemData = problemId ? problems.find(p => p.id === problemId) : null;

  return (
    <Layout style={{ minHeight: '100vh', background: '#000000' }}>
      <Sidebar collapsed={collapsed} />
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 260, 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: isDashboard 
            ? `linear-gradient(rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.85)), url(${DashboardBG})` 
            : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Fixed 3-dot Toggle Button */}
        <div style={{ 
            position: 'fixed', 
            top: 25, 
            left: 20, 
            zIndex: 2000,
            transition: 'all 0.3s'
        }}>
            <Button 
                type="text" 
                icon={<MoreOutlined style={{ transform: 'rotate(90deg)' }} />} 
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                  fontSize: '24px', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'rgba(20, 20, 20, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}
            />
        </div>

        <Content style={{ 
            background: 'transparent',
            minHeight: '100vh',
            padding: '25px 40px 40px 40px'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header Area Start */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px', 
              width: '100%',
              background: 'rgba(20, 20, 20, 0.4)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)'
            }}>
              
              {/* Left Side: Empty for spacing or future use */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              </div>

              {/* Center/Right alignment wrapper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                {/* Topic Header in Cyberpunk glow */}
                {isProblemPage && problemData && (
                   <div style={{
                     padding: '4px 12px',
                     background: 'rgba(0, 242, 255, 0.05)',
                     border: '1px solid rgba(0, 242, 255, 0.3)',
                     borderRadius: '8px',
                     boxShadow: '0 0 15px rgba(0, 242, 255, 0.1)',
                     marginRight: 'auto', // pushes everything else left
                   }}>
                     <Text style={{
                       fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                       fontWeight: '800',
                       letterSpacing: '1px',
                       textTransform: 'uppercase',
                       fontSize: '12px',
                       background: 'linear-gradient(135deg, #00f2ff 0%, #bc13fe 100%)',
                       WebkitBackgroundClip: 'text',
                       backgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       filter: 'drop-shadow(0 0 5px rgba(0, 242, 255, 0.5))'
                     }}>
                       {problemData.topics.slice(0, 2).join(' / ')}
                     </Text>
                   </div>
                )}

                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'coding-room-invite',
                                label: (
                                    <div style={{ padding: '8px', maxWidth: '280px' }} onClick={() => navigate('/coding-room')}>
                                        <Space align="start" size={12}>
                                            <Avatar icon={<ThunderboltOutlined />} style={{ background: 'var(--neon-cyan)', color: '#000' }} />
                                            <div>
                                                <Text strong style={{ color: 'var(--neon-cyan)', display: 'block' }}>CODING ROOM INVITE</Text>
                                                <Text size="small" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
                                                    CyberCoder is waiting for players to start a speed challenge!
                                                </Text>
                                            </div>
                                        </Space>
                                    </div>
                                )
                            }
                        ]
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                    dropdownStyle={{ 
                        background: 'rgba(10, 10, 20, 0.95)', 
                        border: '1px solid var(--neon-cyan)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)',
                        padding: '8px'
                    }}
                >
                    <Button 
                        type="text" 
                        icon={<BellOutlined />} 
                        style={{ 
                            fontSize: '20px', 
                            color: 'var(--neon-cyan)',
                            background: 'rgba(0, 242, 255, 0.1)',
                            border: '1px solid var(--neon-cyan)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                            boxShadow: '0 0 10px rgba(0, 242, 255, 0.2)'
                        }}
                        className="notification-trigger"
                    />
                </Dropdown>
                <Dropdown 
                    menu={{ 
                      items: [
                        { key: 'profile', label: 'My Profile', icon: <UserOutlined /> },
                        { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
                        { type: 'divider' },
                        { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: logout }
                      ] 
                    }} 
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <div style={{ 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '5px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        transition: 'all 0.3s'
                    }} className="profile-trigger">
                        <Avatar size="small" style={{ background: 'var(--neon-cyan)' }}>{user?.name?.[0] || 'C'}</Avatar>
                        <Space size={4}>
                            <Text style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{user?.name || 'Coder'}</Text>
                            <DownOutlined style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '10px' }} />
                        </Space>
                    </div>
                </Dropdown>
              </div>
            </div>
            {/* Header Area End */}

            {children}
          </div>
        </Content>
      </Layout>

      <style>{`
        .profile-trigger:hover, .notification-trigger:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: var(--neon-cyan) !important;
          box-shadow: 0 0 15px rgba(0, 242, 255, 0.3) !important;
          color: #fff !important;
        }
      `}</style>
    </Layout>
  );
}
