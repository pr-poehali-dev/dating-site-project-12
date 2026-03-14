import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MOCK_MATCHES, MOCK_MESSAGES } from "@/data/mockData";
import { Match } from "@/types/spark";

export default function ChatsTab() {
  const [activeChat, setActiveChat] = useState<Match | null>(MOCK_MATCHES[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [search, setSearch] = useState("");

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

  const filtered = MOCK_MATCHES.filter(m =>
    m.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const ChatPanel = ({ match }: { match: Match }) => (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <button onClick={() => setActiveChat(null)}
          className="md:hidden text-white/50 hover:text-white transition-colors mr-1">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div className="relative">
          <img src={match.user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
          {match.user.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">{match.user.name}</div>
          <div className="text-white/40 text-xs">
            {match.user.online ? "онлайн" : `был(а) ${match.user.lastSeen}`}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
            <Icon name="Phone" size={15} className="text-white/60" />
          </button>
          <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
            <Icon name="Video" size={15} className="text-white/60" />
          </button>
          <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
            <Icon name="MoreVertical" size={15} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">Сегодня</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"} animate-fade-in`}>
            {msg.senderId !== "me" && (
              <img src={match.user.avatar} className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0 self-end" alt="" />
            )}
            <div className={`max-w-[70%] px-4 py-3 ${msg.senderId === "me" ? "msg-own" : "msg-other"}`}>
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
      <div className="px-5 py-4 border-t border-white/5">
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

  return (
    <div className="flex h-[calc(100vh-130px)] md:h-[calc(100vh-81px)]">

      {/* ── LEFT: Chat list ── */}
      <div className={`${activeChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96 border-r border-white/5 flex-shrink-0`}>
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Поиск чатов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(match => (
            <button key={match.id} onClick={() => setActiveChat(match)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/5 transition-all text-left border-b border-white/5 ${
                activeChat?.id === match.id ? "bg-pink-500/10 border-l-2 border-l-pink-500" : ""
              }`}>
              <div className="relative flex-shrink-0">
                <img src={match.user.avatar} alt={match.user.name}
                  className="w-12 h-12 rounded-full object-cover" />
                {match.user.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-semibold text-sm">{match.user.name}</span>
                  <span className="text-white/30 text-xs">{match.lastMessage?.sentAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs truncate max-w-[80%] ${match.unread ? "text-white/80 font-medium" : "text-white/40"}`}>
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

      {/* ── RIGHT: Active chat ── */}
      <div className={`${!activeChat ? "hidden md:flex" : "flex"} flex-1 flex-col min-w-0`}>
        {activeChat ? (
          <ChatPanel match={activeChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mb-2">
              <Icon name="MessageCircle" size={36} className="text-white/20" />
            </div>
            <h3 className="text-white/50 font-semibold text-lg">Выбери чат</h3>
            <p className="text-white/30 text-sm">Выбери собеседника из списка слева, чтобы начать общение</p>
          </div>
        )}
      </div>
    </div>
  );
}
