import React from 'react';
import DashboardLayout from '../../components/UI/dashboardlayout';
const ChatbotIframe = () => {
  return (
    <DashboardLayout>
    <div style={{ width: '100%', height: '80%', minHeight: '700px' }}>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/DsWhyagrmg7o-SwVtOZJZ"
        width="100%"
        style={{ height: '90%', minHeight: '90%' }}
        frameBorder="0"
        title="Chatbot"
      ></iframe>
    </div>
    </DashboardLayout>
  );
};

export default ChatbotIframe;
