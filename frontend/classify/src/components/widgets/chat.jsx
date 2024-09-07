import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEllipsisV } from "react-icons/fa";
import { api } from "../../utils.js";
import Loader from "./loader.jsx";
import { FaPaperPlane } from "react-icons/fa";
import { format } from 'date-fns'; // Consider using date-fns for easier date manipulation
import { FaTrash } from "react-icons/fa";
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
            id: data.id,
            timestamp: data.timestamp,
            deletable : data.deletable
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
          id: data.id,
          timestamp: data.timestamp,
          deletable : data.deletable
        },
      ]);
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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const message = inputValue;
      ws.current.send(
        JSON.stringify({
          text: message,
        })
      );
      setInputValue("");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "HH:mm");
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.timestamp).toDateString();
      if (!acc[messageDate]) acc[messageDate] = [];
      acc[messageDate].push(message);
      return acc;
    }, {});
  };

  const handleDeleteMessage = (msgID, index) => {
    api.delete(`/chat_class/${id}/${msgID}`, {}, 50000,
      (data, status) => {
        setMessages((prevMessages) =>
          prevMessages.filter((_, i) => i !== index)
        );
      },
      (data, status) => {
        toast.error("An error occurred");
      },
      (error) => {}
    );
  };

  if (!messages) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="">
      <div className="transition-all duration-300 ease-in-out w-full h-full bg-white overflow-hidden">
        <ChatWindow
          setIsOpen={setIsOpen}
          groupedMessages={groupedMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          formatTime={formatTime} // Pass formatTime as a prop
          handleDeleteMessage = {handleDeleteMessage}
        />
      </div>
    </div>
  );
};

const ChatWindow = ({
  groupedMessages,
  inputValue,
  setInputValue,
  handleSendMessage,
  formatTime, 
  handleDeleteMessage
}) => {
  const chatEndRef = useRef(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupedMessages]);


  const handleCheckAuth = (msg)=>{
      if (msg.user_email === localStorage.getItem("email")){
        return true
      }

      if (msg.deletable){
        return true
      }
  }
  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 p-4 overflow-y-auto mb-16">
        <div className="flex flex-col">
          {Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <h2 className="text-gray-500 text-center my-4">{date}</h2>
              {groupedMessages[date].map((msg, index) => (
                <div key={index} className="relative group">
                  <div
                    className={`flex ${
                      msg.user_email === localStorage.getItem("email")
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-fit ${
                        msg.user_email === localStorage.getItem("email")
                          ? "bg-purple-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {msg.user_email !== localStorage.getItem("email") && <small className="text-slate-600">{msg.username}</small>}
                      <p className="max-w-[260px] [overflow-wrap:break-word]">
                        {msg.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(msg.timestamp)}
                      </p>

                    </div> 
                    <div className="ml-2  items-center">
                      {handleCheckAuth(msg) && <button
                        onClick={() => {handleDeleteMessage(msg.id, index)
                          setActiveMessageIndex(null)
                        }}

                        className="text-xs"
                      >
                        <FaTrash className="text-gray-500" />
                      </button>}
                    </div>
                  </div>

                  
                </div>
              ))}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <footer className="p-4 absolute bottom-2 border-t-2 w-3/4">
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
            <FaPaperPlane />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatBubble;
