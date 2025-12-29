import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FiDownload, FiFile } from 'react-icons/fi';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderMessage = (message) => {
    const isOwn = message.sender._id === currentUserId;

    return (
      <div key={message._id} className={`message ${isOwn ? 'own' : ''}`}>
        <div className="avatar">
          <img src={message.sender.avatar} alt={message.sender.username} />
        </div>

        <div className="message-content">
          {!isOwn && <div className="message-sender">{message.sender.username}</div>}

          {message.content && <div className="message-text">{message.content}</div>}

          {message.fileUrl && message.fileType === 'image' && (
            <img
              src={message.fileUrl}
              alt="Shared image"
              className="message-image"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
          )}

          {message.fileUrl && message.fileType === 'file' && (
            <a
              href={message.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="message-file"
            >
              <FiFile size={20} />
              <span>Download File</span>
              <FiDownload size={16} />
            </a>
          )}

          <span className="message-time">
            {format(new Date(message.createdAt), 'p')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="empty-state">
          <h3>No messages yet</h3>
          <p>Be the first to send a message!</p>
        </div>
      ) : (
        messages.map(renderMessage)
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
