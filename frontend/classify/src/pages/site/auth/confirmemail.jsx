import React from 'react';
import Logo from '../../../components/widgets/logo';
import { useEffect ,useRef} from 'react';
const WaitingPage = () => {
  const ws = useRef(null)
  const connectWS = () =>{
    const url = "ws://127.0.0.1:8000/ws/activate"
    const token = localStorage.getItem("token");
    ws.current = new WebSocket(url,token);

    const request = {
      "type" : "GET"
    }
    
    ws.current.onopen = (event) => {
      const data = {
        "type" : "Request",
        "code" : "001"
      }
    ws.current.send(JSON.stringify(data))
    }
    ws.current.onmessage = (event) =>{ 
    const data = JSON.parse(event.data)
    console.log(data)
  }

  }

  useEffect(() => {
    connectWS();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 font-sans">
      <div className="text-center">
        {/* Placeholder Image */}
        <Logo />
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">Verifying Your Account</h1>
        {/* Message */}
        <p className="text-lg mb-6">
          Thank you for signing in! We're verifying your account. Please check your email for a confirmation link to complete the process.
        </p>
        {/* Spinner */}
        <div className="spinner mx-auto mb-6"></div>
        {/* Instruction */}
        <p className="text-sm text-gray-600">
          Please do not leave this page until the verification is complete.
        </p>
        {/* Contact Support Link */}
        <div className="mt-6">
          <a href="mailto:support@classify.com" className="text-blue-500 hover:underline">
            Need help? Contact Support
          </a>
        </div>
      </div>

      {/* Spinner Style */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          border: 8px solid #e5e7eb; /* Light gray border */
          border-top: 8px solid #3b82f6; /* Blue border */
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WaitingPage;
