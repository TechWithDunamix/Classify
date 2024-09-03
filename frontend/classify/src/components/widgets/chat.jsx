import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { id } = useParams();
  const ws = useRef(null);

  // Initialize WebSocket connection
  const wsconnect = () => {
    const url = `ws://localhost:8000/ws/chat_class/${id}`;
    ws.current = new WebSocket(url, localStorage.getItem("token"));

    ws.current.onopen = (e) => {
      console.log("WebSocket connected", e);
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, user_email: data.user_email },
      ]);
      toast.success(data.message);
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error", e);
    };
  };

  useEffect(() => {
    wsconnect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const message = inputValue;
      ws.current.send(
        JSON.stringify({
          text: message,
        })
      );
      setInputValue(""); // Clear input field after sending the message
    }
  };

  return (
    <div className="fixed bottom-64 md:bottom-4 right-5 z-50">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "w-full h-full md:w-80 md:h-96" : "w-16 h-16"
        } bg-white shadow-lg overflow-hidden`}
      >
        {isOpen ? (
          <ChatWindow
            setIsOpen={setIsOpen}
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
          />
        ) : (
          <BubbleButton setIsOpen={setIsOpen} />
        )}
      </div>
    </div>
  );
};

const BubbleButton = ({ setIsOpen }) => (
  <button
    className="w-full h-full flex items-center justify-center bg-purple-500 text-white"
    onClick={() => setIsOpen(true)}
  >
    💬
  </button>
);

const ChatWindow = ({
  setIsOpen,
  messages,
  inputValue,
  setInputValue,
  handleSendMessage,
}) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat window when a new message is added
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <header className="bg-purple-500 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg">Chat</h2>
        <button className="text-white" onClick={() => setIsOpen(false)}>
          ✖️
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.user_email === localStorage.getItem("email") ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-2 rounded-lg ${msg.user_email === localStorage.getItem("email") ? "bg-purple-500 text-white" : "bg-gray-300"}`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <footer className="p-4">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 border bg-white"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-purple-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatBubble;
