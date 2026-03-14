import Icon from "@/components/ui/icon";
import { MOCK_MATCHES, DISCOVER_CARDS } from "@/data/mockData";

interface Props {
  onOpenChat: () => void;
}

export default function MatchesTab({ onOpenChat }: Props) {
  const newMatches = DISCOVER_CARDS.slice(0, 6);

  return (
    <div className="h-[calc(100vh-130px)] md:h-[calc(100vh-81px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-6">

        {/* New matches */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl">Новые матчи</h3>
            <span className="text-pink-400 text-sm">{newMatches.length} новых</span>
          </div>
          {/* Grid on desktop, horizontal scroll on mobile */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {newMatches.map((user, i) => (
              <button key={i} onClick={onOpenChat}
                className="flex flex-col items-center gap-2 group">
                <div className="relative">
                  <div className="story-ring p-[2px]">
                    <img src={user.avatar} alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-background group-hover:scale-105 transition-transform" />
                  </div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-background" />
                  )}
                </div>
                <span className="text-white/70 text-xs">{user.name}</span>
              </button>
            ))}
          </div>
          <div className="md:hidden flex gap-4 overflow-x-auto pb-2">
            {newMatches.map((user, i) => (
              <button key={i} onClick={onOpenChat}
                className="flex-shrink-0 flex flex-col items-center gap-2 group">
                <div className="relative">
                  <div className="story-ring w-18 h-18 p-[2px]">
                    <img src={user.avatar} alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-background" />
                  </div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-background" />
                  )}
                </div>
                <span className="text-white/70 text-xs">{user.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Matches list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl">Сообщения</h3>
          </div>

          {/* Grid on desktop */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {MOCK_MATCHES.map(match => (
              <button key={match.id} onClick={onOpenChat}
                className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all text-left">
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
                  <div className="flex items-center gap-1">
                    {match.lastMessage?.senderId === "me" && (
                      <Icon name="Check" size={12} className="text-white/30 flex-shrink-0" />
                    )}
                    <p className={`text-sm truncate ${match.unread ? "text-white/80 font-medium" : "text-white/40"}`}>
                      {match.lastMessage?.text}
                    </p>
                  </div>
                </div>
                {(match.unread ?? 0) > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 notif-badge rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {match.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List on mobile */}
          <div className="md:hidden space-y-3">
            {MOCK_MATCHES.map(match => (
              <button key={match.id} onClick={onOpenChat}
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
                  <p className={`text-sm truncate ${match.unread ? "text-white/80 font-medium" : "text-white/40"}`}>
                    {match.lastMessage?.text}
                  </p>
                </div>
                {(match.unread ?? 0) > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 notif-badge rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {match.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state hint */}
        <div className="mt-6 glass rounded-2xl p-5 text-center card-glow-purple max-w-sm mx-auto">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-white/60 text-sm">Больше матчей — больше знакомств.<br/>Продолжай ставить лайки!</p>
          <button className="mt-3 btn-gradient text-white text-sm font-medium px-5 py-2 rounded-xl">
            Найти людей
          </button>
        </div>
      </div>
    </div>
  );
}
