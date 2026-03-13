import Icon from "@/components/ui/icon";
import { MOCK_MATCHES, DISCOVER_CARDS } from "@/data/mockData";

interface Props {
  onOpenChat: () => void;
}

export default function MatchesTab({ onOpenChat }: Props) {
  const newMatches = DISCOVER_CARDS.slice(0, 4);

  return (
    <div className="h-[calc(100vh-130px)] overflow-y-auto px-4 py-4">
      {/* New matches */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-lg">Новые матчи</h3>
          <span className="text-pink-400 text-sm">{newMatches.length} новых</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-lg">Сообщения</h3>
        </div>
        <div className="space-y-3">
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
      </div>

      {/* Empty state hint */}
      <div className="mt-6 glass rounded-2xl p-5 text-center card-glow-purple">
        <div className="text-3xl mb-2">✨</div>
        <p className="text-white/60 text-sm">Больше матчей — больше знакомств.<br/>Продолжай ставить лайки!</p>
        <button className="mt-3 btn-gradient text-white text-sm font-medium px-5 py-2 rounded-xl">
          Найти людей
        </button>
      </div>
    </div>
  );
}
