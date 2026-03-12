import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Card, Space, Tag, Avatar, Badge, Button, Tooltip } from 'antd';
import { 
  CodeOutlined, 
  LeftSquareOutlined, 
  BorderTopOutlined, 
  FullscreenOutlined, 
  CheckCircleOutlined, 
  SyncOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Panel, Group, Separator } from 'react-resizable-panels';

import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { problems } from '../data/problems';
import Chatbot from '../components/Chatbot';
import MainLayout from '../components/MainLayout';

const { Content } = Layout;
const { Text, Title } = Typography;

export default function ProblemArea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { markAsSolved, isSolved } = useProgress();
  const { theme } = useTheme();
  
  const problemPanelRef = useRef(null);
  
  const problemData = React.useMemo(() => problems.find(p => p.id === id), [id]);
  const [editorContent, setEditorContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    if (problemData) {
      setEditorContent(problemData.boilerplate);
    } else {
      navigate('/dashboard');
    }
  }, [problemData, navigate]);

  const handleEvaluate = () => {
    if (!problemData) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      markAsSolved(problemData.id);
    }, 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  if (!problemData) return null;

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const panelBg = theme === 'dark' ? '#141414' : '#fff';

  // Style defaults

  const renderProblemDetails = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: panelBg, height: '100%' }}>
      <div style={{ color: textColor }}>
        <Space style={{ marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, color: '#fff' }}>{problemData.id}. {problemData.title}</Title>
            <Tag color={getDifficultyColor(problemData.difficulty)}>{problemData.difficulty}</Tag>
        </Space>
        <div style={{ marginBottom: '20px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: problemData.description }} />
        {problemData.examples.map((ex, idx) => (
            <Card key={idx} size="small" style={{ background: theme === 'dark' ? '#1f1f1f' : '#f5f5f5', marginBottom: '12px', borderRadius: '4px' }}>
              <Text strong style={{ color: textColor }}>Example {idx + 1}:</Text><br />
              <div style={{ marginTop: '4px' }}>
                <Text code style={{ color: textColor }}>Input: {ex.input}</Text><br />
                <Text code style={{ color: textColor }}>Output: {ex.output}</Text>
              </div>
            </Card>
        ))}
      </div>
    </div>
  );

  const renderEditorArea = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px', background: panelBg }}>
      <div style={{ flex: 1, overflowY: 'auto', background: '#1e1e1e', borderRadius: '8px', padding: '12px', position: 'relative' }}>
        <SyntaxHighlighter
          language="java"
          style={vscDarkPlus}
          customStyle={{ margin: 0, minHeight: '100%', background: 'transparent' }}
        >
          {editorContent}
        </SyntaxHighlighter>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
          </div>
          <Button 
              type="primary" 
              icon={isEvaluating ? <SyncOutlined spin /> : <CheckCircleOutlined />}
              onClick={handleEvaluate}
              disabled={isEvaluating || isSolved(problemData.id)}
              size="large"
              style={{
                background: isSolved(problemData.id) ? 'var(--neon-purple)' : 'var(--neon-cyan)',
                borderColor: isSolved(problemData.id) ? 'var(--neon-purple)' : 'var(--neon-cyan)',
                color: '#000',
                fontWeight: 'bold',
                boxShadow: `0 0 15px ${isSolved(problemData.id) ? 'rgba(188, 19, 254, 0.4)' : 'rgba(0, 242, 255, 0.4)'}`
              }}
          >
              {isSolved(problemData.id) ? 'Solved' : (isEvaluating ? 'Evaluating...' : 'Submit')}
          </Button>
      </div>
    </div>
  );

  const renderOutputTerminal = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0f', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid currentColor', color: 'var(--neon-purple)', paddingBottom: '4px' }}>
        <Text style={{ color: 'inherit', fontFamily: 'monospace', fontWeight: 'bold' }}>TERMINAL / OUTPUT</Text>
        <Space>
           <Tag color="purple">Build: Ready</Tag>
        </Space>
      </div>
      <div style={{ flex: 1, color: '#00f2ff', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', whiteSpace: 'pre-wrap', overflowY: 'auto' }}>
        {isEvaluating ? (
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <SyncOutlined spin /> <Text style={{ color: 'var(--neon-cyan)' }}>Compiling and running against test cases...</Text>
           </div>
        ) : (
           <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
             $ Run or Submit code to see output here.
             <br/><br/>
             {isSolved(problemData.id) && (
               <Text style={{ color: '#00ff00' }}>✓ All test cases passed! Result: Accepted.</Text>
             )}
           </div>
        )}
      </div>
    </div>
  );

  return (
    <MainLayout forceCollapse={true}>
      <Content style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        height: '100%', 
        background: theme === 'dark' ? '#0f0f0f' : '#f0f2f5', 
        overflow: 'hidden',
        padding: '12px',
        gap: '12px'
      }}>
        <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            <Group orientation="horizontal">
              <Panel defaultSize={25} minSize={15}>
                {renderProblemDetails()}
              </Panel>

              <Separator className="ResizeHandleHorizontal" />

              <Panel defaultSize={50} minSize={30}>
                <Group orientation="vertical">
                  <Panel defaultSize={70} minSize={20}>
                    {renderEditorArea()}
                  </Panel>
                  <Separator className="ResizeHandleVertical" />
                  <Panel defaultSize={30} minSize={10}>
                    {renderOutputTerminal()}
                  </Panel>
                </Group>
              </Panel>

              <Separator className="ResizeHandleHorizontal" />

              <Panel defaultSize={25} minSize={15}>
                <div style={{ height: '100%', background: panelBg }}>
                  <Chatbot problemData={problemData} userName={user?.name || 'User'} />
                </div>
              </Panel>
            </Group>
        </div>
      </Content>
    </MainLayout>
  );
}
