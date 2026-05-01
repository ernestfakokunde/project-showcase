import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Messages = () => {
  const { user, authFetch } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true);
      const res = await authFetch("/api/messages/conversations");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setConversations(data.conversations);
    } catch (error) {
      addToast(error.message || "Failed to load conversations", "error");
    } finally {
      setConversationsLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setLoading(true);
      const res = await authFetch(`/messages/${userId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setMessages(data.messages);
    } catch (error) {
      addToast(error.message || "Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      addToast("Message cannot be empty", "error");
      return;
    }

    if (!selectedConversation) {
      addToast("Please select a conversation", "error");
      return;
    }

    try {
      const res = await authFetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedConversation.userId,
          text: messageText,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Add message to chat
      setMessages([...messages, data.message]);
      setMessageText("");

      // Update conversation in list
      const updatedConversations = conversations.map((conv) =>
        conv.userId === selectedConversation.userId
          ? {
              ...conv,
              lastMessage: messageText,
              lastMessageTime: new Date(),
            }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      addToast(error.message || "Failed to send message", "error");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Delete this message?")) return;

    try {
      const res = await authFetch(`/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete message");

      setMessages(messages.filter((msg) => msg._id !== messageId));
      addToast("Message deleted", "success");
    } catch (error) {
      addToast(error.message || "Failed to delete message", "error");
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return messageDate.toLocaleDateString();
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Messages" />

      <div className="flex h-[calc(100vh-70px)]">
        {/* Conversations List */}
        <div className="w-80 border-r border-white/10 bg-[#111118] overflow-y-auto">
          {conversationsLoading ? (
            <div className="p-6 text-center text-white/50">
              <p>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-white/50">
              <p>No conversations yet</p>
              <p className="mt-2 text-xs">Start a conversation by requesting to join a project</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer transition ${
                    selectedConversation?.userId === conversation.userId
                      ? "bg-[#7f77dd]/20 border-l-2 border-[#7f77dd]"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#7f77dd] flex items-center justify-center text-xs font-bold">
                        {conversation.username[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-sm truncate">
                          @{conversation.username}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="text-[10px] bg-blue-500 px-2 py-1 rounded-full flex-shrink-0">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-[10px] text-white/30 mt-1">
                        {formatTime(conversation.lastMessageTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-white/10 bg-[#111118] p-4 flex items-center gap-3">
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#7f77dd] flex items-center justify-center text-sm font-bold">
                    {selectedConversation.username[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-medium">@{selectedConversation.username}</h2>
                  <p className="text-xs text-white/50">Active now</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="text-center text-white/50">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-white/50">
                    <p>No messages yet</p>
                    <p className="text-xs mt-2">Start the conversation below</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.from._id === user._id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`group max-w-xs px-4 py-2 rounded-lg ${
                          message.from._id === user._id
                            ? "bg-[#7f77dd] text-white"
                            : "bg-white/10 text-white/90"
                        }`}
                      >
                        <p className="text-sm break-words">{message.text}</p>
                        <p className="text-xs mt-1 opacity-50">{formatTime(message.createdAt)}</p>
                        {message.from._id === user._id && (
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="text-xs opacity-0 group-hover:opacity-100 mt-2 text-white/70 hover:text-white transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-white/10 bg-[#111118] p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#7f77dd]"
                  />
                  <button
                    type="submit"
                    className="bg-[#7f77dd] hover:bg-[#7f77dd]/80 px-6 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/50">
              <div className="text-center">
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm mt-2">or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Messages;
