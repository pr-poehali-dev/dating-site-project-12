import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MOCK_MATCHES, MOCK_MESSAGES } from "@/data/mockData";
import { Match } from "@/types/spark";

export default function ChatsTab() {
  const [activeChat, setActiveChat] = useState<Match | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: "me",
      text: message,
      sentAt: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }]);
    setMessage("");
  };

  if (activeChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-130px)]">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 glass border-b border-white/5">
          <button onClick={() => setActiveChat(null)} className="text-white/50 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="relative">
            <img src={activeChat.user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
            {activeChat.user.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">{activeChat.user.name}</div>
            <div className="text-white/40 text-xs">
              {activeChat.user.online ? "онлайн" : `был(а) ${activeChat.user.lastSeen}`}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
              <Icon name="Phone" size={16} className="text-white/60" />
            </button>
            <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
              <Icon name="Video" size={16} className="text-white/60" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Date divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">Сегодня</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"} animate-fade-in`}>
              {msg.senderId !== "me" && (
                <img src={activeChat.user.avatar} className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0 self-end" alt="" />
              )}
              <div className={`max-w-[75%] px-4 py-3 ${msg.senderId === "me" ? "msg-own" : "msg-other"}`}>
                <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
                  <span className="text-white/40 text-[10px]">{msg.sentAt}</span>
                  {msg.senderId === "me" && (
                    <Icon name={msg.read ? "CheckCheck" : "Check"} size={12} className="text-white/40" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 glass border-t border-white/5">
          <div className="flex items-center gap-3">
            <button className="glass w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0">
              <Icon name="ImagePlus" size={18} className="text-white/50" />
            </button>
            <input
              type="text"
              placeholder="Написать сообщение..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all text-sm"
            />
            <button
              onClick={sendMessage}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                message.trim() ? "btn-gradient" : "glass opacity-50"
              }`}
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-130px)] overflow-y-auto px-4 py-4">
      {/* Search */}
      <div className="relative mb-4">
        <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Поиск чатов..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all text-sm"
        />
      </div>

      {/* Chats list */}
      <div className="space-y-2">
        {MOCK_MATCHES.map(match => (
          <button key={match.id} onClick={() => setActiveChat(match)}
            className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all text-left">
            <div className="relative flex-shrink-0">
              <img src={match.user.avatar} alt={match.user.name}
                className="w-14 h-14 rounded-full object-cover" />
              {match.user.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-white font-semibold">{match.user.name}</span>
                <span className="text-white/30 text-xs">{match.lastMessage?.sentAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate max-w-[80%] ${match.unread ? "text-white/80 font-medium" : "text-white/40"}`}>
                  {match.lastMessage?.senderId === "me" ? "Ты: " : ""}{match.lastMessage?.text}
                </p>
                {(match.unread ?? 0) > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 notif-badge rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {match.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
