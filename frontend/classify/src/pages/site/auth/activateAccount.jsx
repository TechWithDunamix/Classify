import React, { useEffect } from 'react';
import { useRef,useState } from 'react';
import { useParams } from 'react-router-dom';
const EmailConfirmation = () => {
  const btnRef = useRef()
  const {id,token} = useParams()

  useEffect(() => {
    const url = `wss://vocational-fish-techwithdunamix-65e5eda4.koyeb.app/ws/activate?token=${token}`;
    const ws = new WebSocket(url)
    ws.onopen = (e) => {
      console.log("Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.code === "003"){
        window.close()
      }
    }

    const btn = document.querySelector("#submit-btn");
    btn.addEventListener("click", (event) => {
      const data = {
        type: "confirmed",
        code: "002",
        id : id
      };
      ws.send(JSON.stringify(data));
    });

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Logo */}
        <div className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Logo"
            className="mx-auto w-20 mb-4"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Confirm Your Email
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please confirm your email address to complete your registration.
        </p>

        {/* Call to Action Button */}
        <div className="text-center mb-6">
          <button
            ref={btnRef}
            id="submit-btn"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg inline-block"
          >
            Confirm Email
          </button>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 mb-4" />

        {/* Footer Section */}
        <p className="text-gray-600 text-sm text-center">
          If you didn’t create this account, you can safely ignore this email.
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmation;
