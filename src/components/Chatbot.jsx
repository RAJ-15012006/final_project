import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Avatar, Typography, Tooltip, Input, Button,
  List, Space, Badge, Row, Col, Tag, message as antMessage
} from 'antd';
import {
  UserOutlined, SettingOutlined, LikeOutlined, DislikeOutlined,
  CopyOutlined, SendOutlined, BulbOutlined, ReloadOutlined,
  CompassOutlined, DashboardOutlined, WarningOutlined, CodeOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import {
  askTutor,
  getHint,
  getApproach,
  getComplexity,
  getMistakes,
  getCodeSolution
} from '../services/api';

const { Text } = Typography;

// ── Markdown Renderer ────────────────────────────────────────────────────────

function MarkdownRenderer({ content, theme }) {
  const isDark = theme === 'dark';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    antMessage.success('Copied to clipboard!');
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div style={{
              position: 'relative',
              marginTop: '10px',
              marginBottom: '10px',
              border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: isDark ? '#111827' : '#1f2937',
                color: '#9ca3af',
                padding: '6px 12px',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, color: '#60a5fa' }}>{match[1].toUpperCase()}</span>
                <CopyOutlined
                  style={{ cursor: 'pointer', color: '#e5e7eb' }}
                  onClick={() => copyToClipboard(String(children))}
                />
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '12px',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code style={{
              background: isDark ? '#1e293b' : '#e0e7ff',
              color: isDark ? '#93c5fd' : '#1d4ed8',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'monospace'
            }} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ── Welcome Message ──────────────────────────────────────────────────────────

function buildWelcomeMessage(userName, problemData) {
  const user = userName || 'Student';
  if (problemData) {
    return `### Welcome, **${user}**! 👋\n\nI'm **JARVIS**, your AI competitive programming mentor. I see we are working on **${problemData.title}** (${problemData.difficulty || 'DSA'}).\n\nChoose an action below or ask any question:\n- 💡 **Hint**: Get progressive clues without spoiling the answer\n- 🧠 **Approach**: Learn the algorithmic intuition and strategy\n- ⏱️ **Complexity**: Analyze Big-O Time and Space requirements\n- ⚠️ **Pitfalls**: Review tricky edge cases to avoid bugs\n- 💻 **Solution Code**: View complete, well-commented code`;
  }
  return `### Welcome, **${user}**! 👋\n\nI'm **JARVIS**, your AI competitive programming mentor. Ask me any DSA question or select a problem to explore hints, approaches, complexities, and code solutions!`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Chatbot({ problemData, userName, isFullPage = false }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const { theme } = useTheme();
  const messagesEndRef = useRef(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: buildWelcomeMessage(userName, problemData),
    }]);
    setHintLevel(1);
  }, [problemData, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text }]);
  };

  const addErrorMessage = (errText) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'bot',
      text: `⚠️ **Error:** ${errText}\n\nPlease check that your backend server is active at \`http://localhost:8000\`.`,
    }]);
  };

  // ── 1. Open-ended Query ─────────────────────────────────────────────────────
  const handleSend = async () => {
    const msg = inputValue.trim();
    if (!msg || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: msg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const data = await askTutor(msg, problemData?.title || null);
      addBotMessage(data.response || 'No response received.');
    } catch (err) {
      console.error('[Chatbot] askTutor error:', err);
      addErrorMessage(err.message || 'Could not connect to AI backend.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── 2. Progressive Hint ─────────────────────────────────────────────────────
  const handleHint = async () => {
    if (!problemData?.title || isTyping) return;

    const userMsg = `💡 Give me Hint Level ${hintLevel} for ${problemData.title}`;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await getHint(problemData.title, hintLevel);
      addBotMessage(data.response || 'Could not generate hint.');
      setHintLevel(prev => Math.min(prev + 1, 3));
    } catch (err) {
      console.error('[Chatbot] getHint error:', err);
      addErrorMessage(err.message || 'Could not generate hint.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── 3. Approach & Intuition ─────────────────────────────────────────────────
  const handleApproach = async () => {
    if (!problemData?.title || isTyping) return;

    const userMsg = `🧠 Explain the recommended approach and algorithm for ${problemData.title}`;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await getApproach(problemData.title);
      addBotMessage(data.response || 'Could not generate approach.');
    } catch (err) {
      console.error('[Chatbot] getApproach error:', err);
      addErrorMessage(err.message || 'Could not fetch approach.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── 4. Complexity Analysis ──────────────────────────────────────────────────
  const handleComplexity = async () => {
    if (!problemData?.title || isTyping) return;

    const userMsg = `⏱️ What is the Time and Space complexity for ${problemData.title}?`;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await getComplexity(problemData.title);
      addBotMessage(data.response || 'Could not analyze complexity.');
    } catch (err) {
      console.error('[Chatbot] getComplexity error:', err);
      addErrorMessage(err.message || 'Could not analyze complexity.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── 5. Common Mistakes ──────────────────────────────────────────────────────
  const handleMistakes = async () => {
    if (!problemData?.title || isTyping) return;

    const userMsg = `⚠️ What are the common pitfalls and edge cases for ${problemData.title}?`;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await getMistakes(problemData.title);
      addBotMessage(data.response || 'Could not fetch common mistakes.');
    } catch (err) {
      console.error('[Chatbot] getMistakes error:', err);
      addErrorMessage(err.message || 'Could not fetch mistakes.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── 6. Show Solution Code ───────────────────────────────────────────────────
  const handleCode = async () => {
    if (!problemData?.title || isTyping) return;

    const userMsg = `💻 Provide the full solution code for ${problemData.title}`;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await getCodeSolution(problemData.title, 'Java');
      addBotMessage(data.response || 'Could not generate code solution.');
    } catch (err) {
      console.error('[Chatbot] getCodeSolution error:', err);
      addErrorMessage(err.message || 'Could not generate code.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── Reset Chat ──────────────────────────────────────────────────────────────
  const handleReset = () => {
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: buildWelcomeMessage(userName, problemData),
    }]);
    setHintLevel(1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    antMessage.success('Copied!');
  };

  return (
    <Card
      style={{
        flex: 1,
        borderRadius: isFullPage ? '16px' : '12px',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.6)' : '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        background: isDark ? '#111827' : '#ffffff'
      }}
      bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 18px',
        background: isDark ? '#1f2937' : '#f8fafc',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Space size="middle">
          <Logo size={26} />
          <div>
            <span style={{
              display: 'block',
              fontWeight: 700,
              fontSize: '14px',
              color: isDark ? '#f9fafb' : '#0f172a'
            }}>
              JARVIS AI Tutor
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#9ca3af' : '#64748b' }}>
                Online · Groq (LLaMA 3.3) · RAG
              </span>
            </div>
          </div>
        </Space>
        <Tooltip title="Reset chat session">
          <Button
            type="text"
            icon={<ReloadOutlined />}
            size="small"
            onClick={handleReset}
            style={{ color: isDark ? '#9ca3af' : '#64748b' }}
          />
        </Tooltip>
      </div>

      {/* ── Chat Messages ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: isDark ? '#0f172a' : '#f8fafc'
      }}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{
              borderBottom: 'none',
              padding: '6px 0',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                maxWidth: '92%'
              }}>
                <Avatar
                  icon={msg.sender === 'user' ? <UserOutlined /> : <Logo size={22} />}
                  style={{
                    backgroundColor: msg.sender === 'user' ? '#2563eb' : 'transparent',
                    marginLeft: msg.sender === 'user' ? '10px' : '0',
                    marginRight: msg.sender === 'user' ? '0' : '10px',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                  size="default"
                />
                <div style={{ maxWidth: '100%' }}>
                  <div style={{
                    background: msg.sender === 'user'
                      ? '#2563eb'
                      : (isDark ? '#1e293b' : '#ffffff'),
                    color: msg.sender === 'user'
                      ? '#ffffff'
                      : (isDark ? '#f1f5f9' : '#1e293b'),
                    padding: '10px 14px',
                    borderRadius: '12px',
                    borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px',
                    borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                    border: msg.sender === 'bot'
                      ? (isDark ? '1px solid #334155' : '1px solid #e2e8f0')
                      : 'none',
                    boxShadow: isDark
                      ? '0 2px 8px rgba(0,0,0,0.3)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {msg.sender === 'user' ? (
                      <span style={{ color: '#ffffff', whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                    ) : (
                      <MarkdownRenderer content={msg.text} theme={theme} />
                    )}
                  </div>
                  {msg.sender === 'bot' && (
                    <div style={{ marginTop: '6px', marginLeft: '6px' }}>
                      <Space size="middle">
                        <Tooltip title="Helpful"><LikeOutlined style={{ color: isDark ? '#64748b' : '#94a3b8', cursor: 'pointer', fontSize: '13px' }} /></Tooltip>
                        <Tooltip title="Not helpful"><DislikeOutlined style={{ color: isDark ? '#64748b' : '#94a3b8', cursor: 'pointer', fontSize: '13px' }} /></Tooltip>
                        <Tooltip title="Copy text"><CopyOutlined style={{ color: isDark ? '#64748b' : '#94a3b8', cursor: 'pointer', fontSize: '13px' }} onClick={() => copyToClipboard(msg.text)} /></Tooltip>
                      </Space>
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', paddingLeft: '4px' }}>
            <Logo size={22} />
            <div style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '8px 16px',
              borderRadius: '16px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                JARVIS is analyzing...
              </span>
              <div className="typing-dot" style={{ width: '5px', height: '5px', background: '#3b82f6', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both' }} />
              <div className="typing-dot" style={{ width: '5px', height: '5px', background: '#3b82f6', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
              <div className="typing-dot" style={{ width: '5px', height: '5px', background: '#3b82f6', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Action Workflow Buttons ────────────────────────────────────── */}
      {problemData && (
        <div style={{
          padding: '10px 14px',
          background: isDark ? '#1e293b' : '#ffffff',
          borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {/* 1. Progressive Hint */}
          <button
            onClick={handleHint}
            disabled={isTyping}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: isDark ? '1px solid #059669' : '1px solid #10b981',
              background: isDark ? '#064e3b' : '#ecfdf5',
              color: isDark ? '#6ee7b7' : '#047857',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isTyping ? 'not-allowed' : 'pointer',
              opacity: isTyping ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            <BulbOutlined /> Hint {hintLevel}/3
          </button>

          {/* 2. Approach */}
          <button
            onClick={handleApproach}
            disabled={isTyping}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: isDark ? '1px solid #2563eb' : '1px solid #3b82f6',
              background: isDark ? '#1e3a8a' : '#eff6ff',
              color: isDark ? '#93c5fd' : '#1d4ed8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isTyping ? 'not-allowed' : 'pointer',
              opacity: isTyping ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            <CompassOutlined /> Approach
          </button>

          {/* 3. Complexity */}
          <button
            onClick={handleComplexity}
            disabled={isTyping}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: isDark ? '1px solid #7c3aed' : '1px solid #8b5cf6',
              background: isDark ? '#4c1d95' : '#f5f3ff',
              color: isDark ? '#c4b5fd' : '#6d28d9',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isTyping ? 'not-allowed' : 'pointer',
              opacity: isTyping ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            <DashboardOutlined /> Complexity
          </button>

          {/* 4. Common Mistakes */}
          <button
            onClick={handleMistakes}
            disabled={isTyping}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: isDark ? '1px solid #d97706' : '1px solid #f59e0b',
              background: isDark ? '#78350f' : '#fffbeb',
              color: isDark ? '#fde68a' : '#b45309',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isTyping ? 'not-allowed' : 'pointer',
              opacity: isTyping ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            <WarningOutlined /> Pitfalls
          </button>

          {/* 5. Solution Code */}
          <button
            onClick={handleCode}
            disabled={isTyping}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: isDark ? '1px solid #dc2626' : '1px solid #ef4444',
              background: isDark ? '#7f1d1d' : '#fef2f2',
              color: isDark ? '#fca5a5' : '#b91c1c',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isTyping ? 'not-allowed' : 'pointer',
              opacity: isTyping ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            <CodeOutlined /> Show Code
          </button>
        </div>
      )}

      {/* ── Input Box ───────────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 14px',
        borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        background: isDark ? '#111827' : '#ffffff',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          border: isDark ? '1px solid #374151' : '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '8px 10px',
          background: isDark ? '#1f2937' : '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <textarea
            rows={2}
            placeholder="Ask JARVIS anything about this problem... (e.g. 'How to optimize space?')"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isTyping}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '14px',
              color: isDark ? '#f9fafb' : '#0f172a',
              background: 'transparent',
              fontFamily: 'inherit',
              lineHeight: '1.4'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: isDark ? '#64748b' : '#94a3b8' }}>
              Press <b>Enter</b> to send · <b>Shift+Enter</b> for newline
            </span>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: !inputValue.trim() || isTyping ? (isDark ? '#374151' : '#e2e8f0') : '#2563eb',
                color: !inputValue.trim() || isTyping ? (isDark ? '#9ca3af' : '#94a3b8') : '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: !inputValue.trim() || isTyping ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: inputValue.trim() && !isTyping ? '0 2px 6px rgba(37,99,235,0.3)' : 'none'
              }}
            >
              <SendOutlined /> Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </Card>
  );
}
