import React, { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    // Inject the embedded chatbot config
    window.embeddedChatbotConfig = {
      chatbotId: "DsWhyagrmg7o-SwVtOZJZ",
      domain: "www.chatbase.co",
    };

    // Check if the script is already added
    const existingScript = document.getElementById("chatbase-script");
    if (!existingScript) {
      // Create a script tag
      const script = document.createElement("script");
      script.id = "chatbase-script";
      script.src = "https://www.chatbase.co/embed.min.js";
      script.setAttribute("chatbotId", "DsWhyagrmg7o-SwVtOZJZ");
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;

      // Append the script to the document
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div>
      <h2>Chatbot is loading...</h2>
    </div>
  );
};

export default Chatbot;
