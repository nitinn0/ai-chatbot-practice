import { useState } from "react";

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if(!input.trim()) return;

        const userMessage = { role:"user", content: input};
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);


        try{
            const response = await fetch("http://localhost:3001/chat", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body:JSON.stringify({message: input}),
            });

            const data = await response.json();
            const botMessage = { role:"bot", content: data.reply };
            setMessages([...messages,userMessage,botMessage ]);
        }
        catch(error){
            console.log(error)
            setMessages([...messages, { role:"bot", content:"Error fetching" }]);
        }
        setLoading(false);
    
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-2">
            <h1 className="text-xl font-bold text-center mb-4">AI Chatbot</h1>
            <div className="h-64 overflow-y-auto border p-2 mb-4 bg-gray-50 rounded">
              {messages.length === 0 && (
              <div className="text-center mt-4 mb-6">Welcome</div>
              )}
              {messages.map((msg, index) => (
                <div key={index} className={`p-2 my-1 rounded ${msg.role === "user" ? "bg-blue-200 text-right" : "bg-gray-300 text-left"}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 border rounded-l"
                placeholder="Ask me anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      );
    };
    
export default ChatBot;