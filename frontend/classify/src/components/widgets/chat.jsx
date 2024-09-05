import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEllipsisV } from "react-icons/fa";
import { api } from "../../utils.js";
import Loader from "./loader.jsx";
const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { id } = useParams();
  const ws = useRef(null);

  const fetchMessage = () => {
    api.get(
      `/chat_class/${id}`,
      {},
      50000,
      (data, status) => {
        console.log(data);
        const messageArray = [];
        data.map((data, index) => {
          const message = {
            message: data.content,
            user_email: data.email,
            username: data.username,
          };
          messageArray.push(message);
        });

        setMessages(messageArray);
      },
      (error, status) => {
        console.log(error);

        if (status === 404) {
          window.location.href = "/not-found";
        }
      },
      (error) => {
        toast.error("Server not responding");
      }
    );
  };

  useEffect(fetchMessage, []);
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
        {
          message: data.message,
          user_email: data.user_email,
          username: data.username,
        },
      ]);
      toast.success(data.message);
      console.log(messages);
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

  if (!messages){
    return (
      <div>
        <Loader />
      </div>
    )
  }
  return (
    <div className="">
      <div
        className="transition-all duration-300 ease-in-out w-full h-full
         bg-white overflow-hidden"
      >
        <ChatWindow
          setIsOpen={setIsOpen}
          messages={messages}
          setMessages={setMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

const ChatWindow = ({
  setIsOpen,
  messages,
  setMessages,
  inputValue,
  setInputValue,
  handleSendMessage,
}) => {
  const chatEndRef = useRef(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);

  useEffect(() => {
    // Scroll to the bottom of the chat window when a new message is added
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteMessage = (index) => {
    // This function handles deleting the message
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    toast.success("Message deleted");
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col">
          {messages.map((msg, index) => (
            <div key={index} className="relative group">
              <div
                className={`flex ${
                  msg.user_email === localStorage.getItem("email")
                    ? "justify-end"
                    : "justify-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[40%] ${
                    msg.user_email === localStorage.getItem("email")
                      ? "bg-purple-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  <p className="max-w-[60%]">{msg.message}</p>
                </div>
                {/* Options button for each message */}
                <div className="ml-2 flex items-center">
                  <button
                    className="invisible group-hover:visible"
                    onClick={() =>
                      setActiveMessageIndex(
                        activeMessageIndex === index ? null : index
                      )
                    }
                  >
                    <FaEllipsisV className="text-gray-500" />
                  </button>
                </div>
              </div>
              <p className="text-center text-xs text-slate-600">{msg.username}</p>

              {/* Options Menu */}
              {activeMessageIndex === index && (
                <div className="absolute top-8 right-0 bg-white shadow-lg rounded-md z-10">
                  <ul>
                    <li
                      className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer"
                      onClick={() => handleDeleteMessage(index)}
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <footer className="p-4 absolute bottom-2 border-t-2 w-2/4">
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
