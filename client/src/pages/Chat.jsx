import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { ChatProvider } from '../context/ChatContext';

const Chat = () => {
  return (
    <ChatProvider>
      <div className="app">
        <Navbar />
        <div className="chat-container">
          <Sidebar />
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;
