import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Avatar, Typography, Tooltip, Input, Button,
  List, Space, Badge, Row, Col, Tag, message as antMessage
} from 'antd';
import {
  UserOutlined, SettingOutlined, LikeOutlined, DislikeOutlined,
  CopyOutlined, SendOutlined, BulbOutlined, ReloadOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import { askTutor, getHint } from '../services/api';

const { Text } = Typography;

// ── Markdown Renderer ────────────────────────────────────────────────────────

function MarkdownRenderer({ content, theme }) {
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
            <div style={{ position: 'relative', marginTop: '10px', marginBottom: '10px', border: theme === 'dark' ? '1px solid #444' : 'none', borderRadius: '6px' }}>
              <div style={{ background: theme === 'dark' ? '#1a1a1a' : '#2d2d2d', color: '#ccc', padding: '4px 8px', fontSize: '12px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{match[1]}</span>
                <CopyOutlined style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(String(children))} />
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code style={{ background: theme === 'dark' ? '#1d39c4' : '#e6f4ff', color: theme === 'dark' ? '#adc6ff' : '#0958d9', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace' }} {...props}>
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

// ── Initial welcome message ──────────────────────────────────────────────────

function buildWelcomeMessage(userName, problemData) {
  if (problemData) {
    return `Welcome, **${userName || 'Student'}**! I'm **JARVIS**, your AI programming tutor. 🤖\n\nI see we're working on **${problemData.title}** (${problemData.difficulty || 'N/A'}).\n\nI'm here to help you *think through* the problem — not just give you the answer. Try asking me:\n- *"Give me a hint"*\n- *"How do I approach this?"*\n- *"What data structure should I use?"*\n\nWhat are you stuck on?`;
  }
  return `Welcome, **${userName || 'Student'}**! I'm **JARVIS**, your AI programming tutor. 🤖\n\nAsk me about any LeetCode or competitive programming problem. I'll guide you through the thinking process step by step!`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Chatbot({ problemData, userName, isFullPage = false }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const { theme } = useTheme();
  const messagesEndRef = useRef(null);

  // Initialize messages when problem changes
  useEffect(() => {
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: buildWelcomeMessage(userName, problemData),
    }]);
    setHintLevel(1);
  }, [problemData, userName]);

  // Auto-scroll to latest message
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
      text: `⚠️ **Error:** ${errText}\n\nMake sure the backend is running: \`uvicorn main:app --reload\``,
    }]);
  };

  // ── Send general message ────────────────────────────────────────────────────
  const handleSend = async () => {
    const msg = inputValue.trim();
    if (!msg) return;

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

  // ── Progressive hint ────────────────────────────────────────────────────────
  const handleHint = async () => {
    if (!problemData?.title) {
      addBotMessage("Please open a specific problem page to get hints. I don't know which problem to give hints for!");
      return;
    }

    const userMsg = `Give me Hint Level ${hintLevel} for ${problemData.title}`;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await getHint(problemData.title, hintLevel);
      addBotMessage(data.response || 'Could not generate hint.');
      // Advance hint level for next click (max 3)
      setHintLevel(prev => Math.min(prev + 1, 3));
    } catch (err) {
      console.error('[Chatbot] getHint error:', err);
      addErrorMessage(err.message || 'Could not generate hint.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── Reset chat ───────────────────────────────────────────────────────────────
  const handleReset = () => {
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: buildWelcomeMessage(userName, problemData),
    }]);
    setHintLevel(1);
  };

  // ── Copy message ─────────────────────────────────────────────────────────────
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    antMessage.success('Copied!');
  };

  // ── Hint level tag colors ────────────────────────────────────────────────────
  const hintLevelColor = ['green', 'orange', 'red'];
  const hintLevelLabel = ['Hint 1', 'Hint 2', 'Hint 3'];

  return (
    <Card
      style={{
        flex: 1,
        borderRadius: isFullPage ? '12px' : '8px',
        boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        border: theme === 'dark' ? '1px solid #333' : '1px solid #f0f0f0',
      }}
      bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 16px',
        background: theme === 'dark' ? '#1a1a1a' : '#fafafa',
        borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Space>
          <Logo size={24} />
          <div>
            <Text strong style={{ display: 'block', lineHeight: '1.2', fontSize: '13px' }}>JARVIS AI Tutor</Text>
            <Badge status="success" text={<span style={{ fontSize: '11px' }}>Online · RAG Powered</span>} />
          </div>
        </Space>
        <Tooltip title="Reset chat">
          <Button type="text" icon={<ReloadOutlined />} size="small" onClick={handleReset} />
        </Tooltip>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: theme === 'dark' ? '#141414' : '#fff' }}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{ borderBottom: 'none', padding: '8px 0', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', maxWidth: '95%' }}>
                <Avatar
                  icon={msg.sender === 'user' ? <UserOutlined /> : <Logo size={20} />}
                  style={{
                    backgroundColor: msg.sender === 'user' ? '#1677ff' : 'transparent',
                    marginLeft: msg.sender === 'user' ? '8px' : '0',
                    marginRight: msg.sender === 'user' ? '0' : '8px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  size="small"
                />
                <div>
                  <div style={{
                    background: msg.sender === 'user' ? '#1677ff' : (theme === 'dark' ? '#1f1f1f' : '#f0f0f0'),
                    color: msg.sender === 'user' ? '#fff' : (theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.88)'),
                    padding: '8px 12px',
                    borderRadius: '8px',
                    borderTopRightRadius: msg.sender === 'user' ? '0' : '8px',
                    borderTopLeftRadius: msg.sender === 'bot' ? '0' : '8px',
                    border: msg.sender === 'bot' ? (theme === 'dark' ? '1px solid #333' : '1px solid #e8e8e8') : 'none',
                    fontSize: '14px',
                  }}>
                    {msg.sender === 'user' ? (
                      <Text style={{ color: '#fff' }}>{msg.text}</Text>
                    ) : (
                      <MarkdownRenderer content={msg.text} theme={theme} />
                    )}
                  </div>
                  {msg.sender === 'bot' && (
                    <div style={{ marginTop: '4px', marginLeft: '4px' }}>
                      <Space size="middle">
                        <Tooltip title="Helpful"><LikeOutlined style={{ color: '#8c8c8c', cursor: 'pointer' }} /></Tooltip>
                        <Tooltip title="Not helpful"><DislikeOutlined style={{ color: '#8c8c8c', cursor: 'pointer' }} /></Tooltip>
                        <Tooltip title="Copy"><CopyOutlined style={{ color: '#8c8c8c', cursor: 'pointer' }} onClick={() => copyToClipboard(msg.text)} /></Tooltip>
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
          <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '12px' }}>
            <Logo size={24} style={{ marginRight: '8px' }} />
            <div style={{ background: theme === 'dark' ? '#1f1f1f' : '#f0f0f0', padding: '8px 12px', borderRadius: '8px', borderTopLeftRadius: '0', border: theme === 'dark' ? '1px solid #333' : '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="typing-dot" style={{ width: '4px', height: '4px', background: '#bfbfbf', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both' }} />
              <div className="typing-dot" style={{ width: '4px', height: '4px', background: '#bfbfbf', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
              <div className="typing-dot" style={{ width: '4px', height: '4px', background: '#bfbfbf', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '12px', borderTop: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`, background: theme === 'dark' ? '#1a1a1a' : '#fff', flexShrink: 0 }}>
        {/* Quick action: Hint button */}
        {problemData && (
          <div style={{ marginBottom: '8px' }}>
            <Tooltip title={`Get a progressive hint (Level ${hintLevel}/3)`}>
              <Button
                size="small"
                icon={<BulbOutlined />}
                onClick={handleHint}
                disabled={isTyping}
                style={{ marginRight: '8px' }}
              >
                <Tag color={hintLevelColor[hintLevel - 1]} style={{ margin: 0, fontSize: '11px' }}>
                  {hintLevelLabel[hintLevel - 1]}
                </Tag>
              </Button>
            </Tooltip>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Stuck? Click for a progressive hint →
            </Text>
          </div>
        )}

        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder="Ask JARVIS anything about this problem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isTyping}
          style={{ borderRadius: '6px', marginBottom: '8px', background: theme === 'dark' ? '#0f0f0f' : '#fff' }}
        />
        <Row justify="space-between" align="middle">
          <Col>
            <Text type="secondary" style={{ fontSize: '11px' }}>Shift + Enter for new line</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              loading={isTyping}
            >
              Send
            </Button>
          </Col>
        </Row>
      </div>

      <style>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </Card>
  );
}
