import { useState, useEffect } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { userAPI } from '../services/api';

const NewChatModal = ({ onClose }) => {
  const { createPrivateChat, selectChat, onlineUsers } = useChat();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const response = await userAPI.getUsers(query);
        setUsers(response.data);
      } catch (error) {
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      loadUsers();
    }
  };

  const handleSelectUser = async (userId) => {
    const result = await createPrivateChat(userId);
    if (result.success) {
      selectChat('private', result.chat._id);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Start New Conversation</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="sidebar-search" style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
            <input
              type="text"
              className="search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span className="spinner" />
          </div>
        ) : (
          <div className="user-list">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="user-item"
                  onClick={() => handleSelectUser(user._id)}
                >
                  <div className="avatar">
                    <img src={user.avatar} alt={user.username} />
                    <span
                      className={`avatar-status ${
                        onlineUsers.has(user._id) ? 'online' : 'offline'
                      }`}
                    />
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChatModal;
