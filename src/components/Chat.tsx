import { Send, MoreVertical, Trash2, Copy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import Input from "./Input";
import Avatar from "./Avatar";
import Title from "./Title";
import profileService from "../services/profileService";

type ChatProps = {
  mode?: "chatbot" | "chat"; // default chatbot
};

export default function Chat({ mode = "chatbot" }: ChatProps) {
  const { data: userProfile } = useFetch(profileService.getMyProfile);

  const [message, setMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [activeMessageMenu, setActiveMessageMenu] = useState<number | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (message.trim() === "" || !userProfile) return;

    const newMessage = {
      id: Date.now(),
      sender: userProfile.name || "You",
      profilePicture:
        userProfile.avatarUrl ||
        "https://via.placeholder.com/150/cccccc/000000?text=User",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // simulate bot reply if chatbot mode
    if (mode === "chatbot") {
      setTimeout(() => {
        const botMessage = {
          id: Date.now(),
          sender: "Momentum AI",
          profilePicture:
            "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg",
          text: "This is a simulated bot reply!",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    setActiveMessageMenu(null);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setActiveMessageMenu(null);
  };

  return (
    <div className="flex flex-col justify-between items-center h-full">
      {/* Header */}{" "}
      <Title
        title="AI Assistant"
        subtitle="Get instant help with mentors, communities, and platform guidance"
      />
      {/* Main chat box */}
      <div
        className={`grid grid-rows-[15%_75%_10%] border border-[var(--border)] rounded-lg 
        ${mode === "chatbot" ? "h-128 w-150" : "h-[700px] w-[1000px]"}`}
      >
        {/* Top bar */}
        <div className="flex items-center gap-4 border-b border-[var(--border)] p-5 bg-[var(--accent)] rounded-t rounded-b-none rounded-lg">
          <div className="relative">
            <Avatar
              src={
                mode === "chatbot"
                  ? "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
                  : userProfile?.avatarUrl
              }
              name={userProfile?.name}
              size="sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-meduim font-bold text-[var(--main)]">
              {mode === "chatbot" ? "Momentum AI" : userProfile?.name || "User"}
            </h3>
            <span className="text-sm text-gray-500">
              {mode === "chatbot"
                ? "Online • Instant responses"
                : "Online • Active now"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-[var(--bg)]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === userProfile?.name
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
                    msg.sender === userProfile?.name ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar
                    src={msg.profilePicture}
                    name={msg.sender}
                    size="md"
                  />

                  <div className="relative group">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.sender === userProfile?.name
                          ? "bg-blue-100 rounded-br-none"
                          : "bg-white border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-gray-800">{msg.text}</p>
                      <div
                        className={`flex items-center mt-1 text-xs ${
                          msg.sender === userProfile?.name
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <span className="text-gray-500">{msg.time}</span>
                        {msg.sender === userProfile?.name && (
                          <span
                            className={`ml-1 ${
                              msg.read ? "text-blue-500" : "text-gray-400"
                            }`}
                          >
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message options */}
                    <button
                      className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-100 shadow-sm
                        ${
                          msg.sender === userProfile?.name
                            ? "-left-8"
                            : "-right-8"
                        }`}
                      onClick={() =>
                        setActiveMessageMenu(
                          activeMessageMenu === msg.id ? null : msg.id
                        )
                      }
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Menu */}
                    {activeMessageMenu === msg.id && (
                      <div
                        className={`absolute z-10 bg-white rounded-lg shadow-lg py-1 w-32
                        ${
                          msg.sender === userProfile?.name
                            ? "right-0"
                            : "left-0"
                        }`}
                      >
                        {msg.sender === userProfile?.name ? (
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        ) : (
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                            onClick={() => copyMessage(msg.text)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-[var(--border)] justify-between p-6">
          <Input
            id="message"
            name="message"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            size="xl"
          />
          <button
            className="bg-[var(--primary)] p-2 rounded-lg hover:bg-[var(--secondary)] cursor-pointer text-white  disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={message.trim() === ""}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
