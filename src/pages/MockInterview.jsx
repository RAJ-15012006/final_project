import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeftOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LoadingOutlined,
  ThunderboltOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import Logo from '../components/Logo';
import InterviewBG from '../assets/interview_simulator_bg.png';

const { Text, Title } = Typography;
const { TextArea } = Input;

const API_BASE = 'http://localhost:8000';

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%', background: '#00f2ff',
          animation: `bounce 1.2s infinite ${i * 0.2}s`,
        }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(.7);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

export default function MockInterview() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendToBackend = async (history) => {
    const res = await fetch(`${API_BASE}/api/ai/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return (await res.json()).response;
  };

  const startSession = async () => {
    setSessionStarted(true);
    setLoading(true);
    setError(null);
    try {
      const reply = await sendToBackend([]);
      setMessages([{ role: 'assistant', content: reply }]);
    } catch {
      setError('Could not connect to the backend. Make sure http://localhost:8000 is running.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError(null);
    const userMsg = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);
    try {
      const reply = await sendToBackend(newHistory);
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch {
      setError('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!sessionStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.82),rgba(0,0,0,0.92)),url(${InterviewBG})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: "'Inter',sans-serif", padding: 24,
      }}>
        <Logo size={56} />
        <Title level={2} style={{ color: '#fff', marginTop: 20, textAlign: 'center' }}>Mock Interview Session</Title>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, textAlign: 'center', maxWidth: 480, display: 'block' }}>
          JARVIS acts as a senior technical interviewer — real cross-questioning, adaptive difficulty, and a final report card.
        </Text>
        <div style={{
          margin: '36px 0 20px', background: 'rgba(0,242,255,0.05)',
          border: '1px solid rgba(0,242,255,0.15)', borderRadius: 20, padding: '20px 28px', maxWidth: 420, width: '100%',
        }}>
          {['🎙️ JARVIS starts questioning immediately', '💡 Type "end interview" to get your score', '📊 Detailed report card at the end', '⚡ Enter to send · Shift+Enter for new line'].map((tip, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{tip}</Text>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <Button onClick={() => navigate('/interview-simulator')} icon={<ArrowLeftOutlined />}
            style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24 }}>
            Go Back
          </Button>
          <Button type="primary" size="large" icon={<ThunderboltOutlined />} onClick={startSession}
            style={{ background: 'linear-gradient(90deg,#00f2ff,#bc13fe)', border: 'none', borderRadius: 32, height: 52, padding: '0 36px', fontSize: 16, fontWeight: 700 }}>
            Begin Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo size={32} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', animation: 'pulse-dot 2s infinite' }} />
            <Text style={{ color: '#00f2ff', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>LIVE INTERVIEW</Text>
          </div>
        </div>
        <Button danger icon={<CloseCircleOutlined />} onClick={() => navigate('/interview-simulator')} style={{ borderRadius: 20, fontWeight: 600 }}>
          End Session
        </Button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', maxWidth: 860, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, boxSizing: 'border-box' }}>
        {messages.map((msg, idx) => {
          const isAI = msg.role === 'assistant';
          return (
            <div key={idx} style={{ display: 'flex', gap: 14, flexDirection: isAI ? 'row' : 'row-reverse', alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: isAI ? 'rgba(0,242,255,0.12)' : 'rgba(188,19,254,0.12)', border: `1px solid ${isAI ? 'rgba(0,242,255,0.3)' : 'rgba(188,19,254,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: isAI ? '#00f2ff' : '#bc13fe', flexShrink: 0 }}>
                {isAI ? <RobotOutlined /> : <UserOutlined />}
              </div>
              <div style={{ maxWidth: '75%', background: isAI ? 'linear-gradient(135deg,rgba(0,242,255,0.06),rgba(0,0,0,0.4))' : 'linear-gradient(135deg,rgba(188,19,254,0.18),rgba(0,0,0,0.4))', border: `1px solid ${isAI ? 'rgba(0,242,255,0.15)' : 'rgba(188,19,254,0.2)'}`, borderRadius: isAI ? '4px 20px 20px 20px' : '20px 4px 20px 20px', padding: '14px 18px', color: '#fff', fontSize: 14, lineHeight: 1.7 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  code: ({ children }) => <code style={{ background: 'rgba(0,242,255,0.08)', color: '#00f2ff', borderRadius: 4, padding: '1px 6px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{children}</code>,
                  pre: ({ children }) => <pre style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: 10, padding: 16, overflowX: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, margin: '10px 0' }}>{children}</pre>,
                  strong: ({ children }) => <strong style={{ color: '#00f2ff' }}>{children}</strong>,
                  p: ({ children }) => <p style={{ margin: '4px 0' }}>{children}</p>,
                }}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,242,255,0.12)', border: '1px solid rgba(0,242,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2ff', fontSize: 18 }}><RobotOutlined /></div>
            <div style={{ background: 'linear-gradient(135deg,rgba(0,242,255,0.06),rgba(0,0,0,0.4))', border: '1px solid rgba(0,242,255,0.15)', borderRadius: '4px 20px 20px 20px' }}><TypingIndicator /></div>
          </div>
        )}
        {error && <div style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 12, padding: '12px 18px', color: '#ff6b6b', fontSize: 14 }}>⚠️ {error}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '16px 16px 24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <TextArea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send, Shift+Enter for new line)" autoSize={{ minRows: 1, maxRows: 6 }} disabled={loading}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#fff', fontSize: 14, padding: '12px 16px', resize: 'none' }} />
          <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} disabled={!input.trim() || loading}
            style={{ height: 46, width: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#00f2ff,#bc13fe)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,242,255,0.3)' }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>Type "end interview" to finish and receive your score report</Text>
        </div>
      </div>

      <style>{`@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.3}}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,242,255,0.2);border-radius:3px}`}</style>
    </div>
  );
}
