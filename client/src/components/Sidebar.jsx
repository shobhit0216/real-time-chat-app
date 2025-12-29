import { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import CreateRoomModal from './CreateRoomModal';
import NewChatModal from './NewChatModal';

const Sidebar = () => {
  const { user } = useAuth();
  const {
    rooms,
    privateChats,
    activeChat,
    selectChat,
    onlineUsers,
  } = useChat();

  const [activeTab, setActiveTab] = useState('rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = privateChats.filter((chat) => {
    const otherUser = chat.participants.find((p) => p._id !== user?.id);
    return otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderChatItem = (chat, type) => {
    const isActive = activeChat?.type === type && activeChat?.id === chat._id;
    const otherUser = type === 'private'
      ? chat.participants.find((p) => p._id !== user?.id)
      : null;

    const displayName = type === 'room' ? chat.name : otherUser?.username;
    const displayAvatar = type === 'room' ? chat.avatar : otherUser?.avatar;
    const isOnline = type === 'private' && onlineUsers.has(otherUser?._id);

    const lastMessage = chat.lastMessage;
    const lastMessageText = lastMessage
      ? lastMessage.fileUrl
        ? '📎 File'
        : lastMessage.content
      : 'No messages yet';

    const lastActivity = chat.lastActivity || chat.createdAt;

    return (
      <div
        key={chat._id}
        className={`chat-item ${isActive ? 'active' : ''}`}
        onClick={() => selectChat(type, chat._id)}
      >
        <div className="avatar">
          <img src={displayAvatar} alt={displayName} />
          {type === 'private' && (
            <span className={`avatar-status ${isOnline ? 'online' : 'offline'}`} />
          )}
        </div>

        <div className="chat-info">
          <div className="chat-name">
            <span>{displayName}</span>
            <span className="chat-time">
              {formatDistanceToNow(new Date(lastActivity), { addSuffix: true })}
            </span>
          </div>
          <div className="chat-preview">{lastMessageText}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>{activeTab === 'rooms' ? 'Chat Rooms' : 'Direct Messages'}</h2>
          <button
            className="btn-icon"
            onClick={() =>
              activeTab === 'rooms' ? setShowCreateRoom(true) : setShowNewChat(true)
            }
            title={activeTab === 'rooms' ? 'Create Room' : 'New Chat'}
          >
            <FiPlus size={20} />
          </button>
        </div>

        <div className="sidebar-tabs">
          <button
            className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Rooms
          </button>
          <button
            className={`tab ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            Direct
          </button>
        </div>

        <div className="sidebar-search">
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
              placeholder={`Search ${activeTab === 'rooms' ? 'rooms' : 'users'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div className="chat-list">
          {activeTab === 'rooms' ? (
            filteredRooms.length > 0 ? (
              filteredRooms.map((room) => renderChatItem(room, 'room'))
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <p>No rooms found</p>
              </div>
            )
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => renderChatItem(chat, 'private'))
          ) : (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {showCreateRoom && (
        <CreateRoomModal onClose={() => setShowCreateRoom(false)} />
      )}

      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </>
  );
};

export default Sidebar;
