import { useEffect, useRef, useState } from 'react';
import { FiSend, FiPaperclip, FiX } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';
import { format } from 'date-fns';
import MessageList from './MessageList';

const ChatArea = () => {
  const { user } = useAuth();
  const {
    activeChat,
    messages,
    rooms,
    privateChats,
    sendMessage,
    typingUsers,
    startTyping,
    stopTyping,
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentChat = activeChat
    ? activeChat.type === 'room'
      ? rooms.find((r) => r._id === activeChat.id)
      : privateChats.find((c) => c._id === activeChat.id)
    : null;

  const otherUser =
    activeChat?.type === 'private'
      ? currentChat?.participants.find((p) => p._id !== user?.id)
      : null;

  const displayName =
    activeChat?.type === 'room' ? currentChat?.name : otherUser?.username;

  const typingUser = activeChat ? typingUsers[activeChat.id] : null;

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    startTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSend = async () => {
    if ((!messageText.trim() && !selectedFile) || uploading) return;

    let fileUrl = null;
    let fileType = null;

    if (selectedFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await messageAPI.uploadFile(formData);
        fileUrl = response.data.fileUrl;
        fileType = response.data.fileType;
      } catch (error) {
        console.error('File upload error:', error);
        alert('Failed to upload file');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    sendMessage(messageText.trim(), fileUrl, fileType);
    setMessageText('');
    setSelectedFile(null);
    stopTyping();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat) {
    return (
      <div className="chat-main">
        <div className="empty-state">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3>Select a chat to start messaging</h3>
          <p>Choose a room or start a private conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="avatar">
            <img
              src={
                activeChat.type === 'room' ? currentChat?.avatar : otherUser?.avatar
              }
              alt={displayName}
            />
          </div>
          <div className="chat-header-details">
            <h3>{displayName}</h3>
            <p>
              {activeChat.type === 'room'
                ? `${currentChat?.members?.length} members`
                : otherUser?.status || 'offline'}
            </p>
          </div>
        </div>
      </div>

      <MessageList messages={messages} currentUserId={user?.id} />

      {typingUser && typingUser.userId !== user?.id && (
        <div className="typing-indicator">{typingUser.username} is typing...</div>
      )}

      <div className="message-input-container">
        <div className="message-input-wrapper">
          <div className="message-input">
            {selectedFile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--secondary-color)',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <span>📎 {selectedFile.name}</span>
                <button
                  className="btn-icon"
                  onClick={() => setSelectedFile(null)}
                  style={{ marginLeft: 'auto' }}
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            <textarea
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              rows={1}
            />

            <div className="input-actions">
              <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                className="btn-icon"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
              >
                <FiPaperclip size={20} />
              </button>
            </div>
          </div>

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={(!messageText.trim() && !selectedFile) || uploading}
          >
            {uploading ? (
              <span className="spinner" />
            ) : (
              <>
                <FiSend size={18} />
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
