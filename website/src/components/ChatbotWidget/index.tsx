import React, {useState, useRef, useEffect, useCallback} from 'react';
import styles from './ChatbotWidget.module.css';

interface Citation {
  module: string;
  chapter: string;
  section: string;
  url: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isError?: boolean;
}

interface RateLimitInfo {
  remaining: number;
  limit: number;
  reset_at: string;
}

const BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-api.vercel.app'
    : 'http://localhost:8000';

const MAX_MESSAGE_LENGTH = 2000;

export default function ChatbotWidget(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > MAX_MESSAGE_LENGTH) {
      setInput(val.slice(0, MAX_MESSAGE_LENGTH));
      setIsTruncated(true);
    } else {
      setInput(val);
      setIsTruncated(false);
    }
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {role: 'user', content: trimmed};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTruncated(false);
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: trimmed}),
      });

      if (res.status === 429) {
        const data = await res.json();
        const resetAt = data.detail?.reset_at
          ? new Date(data.detail.reset_at).toLocaleTimeString()
          : 'later';
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Query limit reached. Please try again at ${resetAt} or sign in for more questions.`,
            isError: true,
          },
        ]);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.rate_limit) {
        setRateLimit(data.rate_limit);
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          citations: data.citations ?? [],
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Chatbot is temporarily unavailable. Please try again later.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatCitationLabel = (c: Citation) => {
    const chapterNum = c.chapter.match(/^\d+/)?.[0] ?? '';
    return `${c.module} · Ch. ${chapterNum}`;
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={styles.fab}
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close AI tutor' : 'Open AI tutor'}
        title="AI Tutor"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={22} height={22}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="AI Tutor chatbot">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.headerDot} />
              <span className={styles.headerTitle}>NEURAL TUTOR</span>
            </div>
            {rateLimit && (
              <span className={styles.headerQuota}>
                {rateLimit.remaining}/{rateLimit.limit} left
              </span>
            )}
          </div>

          {/* Messages */}
          <div className={styles.messages} aria-live="polite">
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <p>Ask any question about the textbook.</p>
                <p className={styles.emptyHint}>e.g. "What is a ROS 2 node?"</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.role]} ${msg.isError ? styles.error : ''}`}>
                <div className={styles.bubble}>{msg.content}</div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className={styles.citations}>
                    {msg.citations.map((c, ci) => (
                      <a
                        key={ci}
                        href={c.url}
                        className={styles.citationLink}
                        title={`${c.section} — ${c.chapter}`}
                      >
                        {formatCitationLabel(c)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={`${styles.bubble} ${styles.typing}`}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            {isTruncated && (
              <p className={styles.truncationNotice}>
                Message truncated to {MAX_MESSAGE_LENGTH} characters.
              </p>
            )}
            <div className={styles.inputRow}>
              <textarea
                ref={inputRef}
                className={styles.textarea}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a chapter…"
                rows={1}
                aria-label="Chat message"
                disabled={isLoading}
              />
              <button
                className={styles.sendBtn}
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
