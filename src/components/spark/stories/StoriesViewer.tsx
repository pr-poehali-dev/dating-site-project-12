import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Story, StoryComment } from "@/types/spark";

interface UserStoryGroup {
  userId: string;
  userName: string;
  userAvatar: string;
  stories: Story[];
}

interface Props {
  groups: UserStoryGroup[];
  initialGroupIndex: number;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onClose: () => void;
  onStoriesUpdate: (stories: Story[]) => void;
}

const STORY_DURATION = 5000;

export default function StoriesViewer({
  groups,
  initialGroupIndex,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onClose,
  onStoriesUpdate,
}: Props) {
  const [groupIdx, setGroupIdx] = useState(initialGroupIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localGroups, setLocalGroups] = useState<UserStoryGroup[]>(groups);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const group = localGroups[groupIdx];
  const story = group?.stories[storyIdx];

  const goNext = () => {
    if (storyIdx < group.stories.length - 1) {
      setStoryIdx(i => i + 1);
      setProgress(0);
    } else if (groupIdx < localGroups.length - 1) {
      setGroupIdx(g => g + 1);
      setStoryIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (storyIdx > 0) {
      setStoryIdx(i => i - 1);
      setProgress(0);
    } else if (groupIdx > 0) {
      setGroupIdx(g => g - 1);
      setStoryIdx(localGroups[groupIdx - 1].stories.length - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused || showComments) return;

    const step = 100 / (STORY_DURATION / 50);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [storyIdx, groupIdx, paused, showComments]);

  const isLiked = story?.likes.includes(currentUserId);

  const handleLike = () => {
    if (!story) return;
    const updated = { ...story };
    if (isLiked) {
      updated.likes = story.likes.filter(id => id !== currentUserId);
    } else {
      updated.likes = [...story.likes, currentUserId];
    }
    updateStory(updated);
  };

  const handleComment = () => {
    if (!commentText.trim() || !story) return;
    const newComment: StoryComment = {
      id: `c_${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      text: commentText.trim(),
      sentAt: "только что",
    };
    const updated = { ...story, comments: [...story.comments, newComment] };
    updateStory(updated);
    setCommentText("");
  };

  const updateStory = (updated: Story) => {
    const newGroups = localGroups.map(g => ({
      ...g,
      stories: g.stories.map(s => s.id === updated.id ? updated : s),
    }));
    setLocalGroups(newGroups);
    const allStories = newGroups.flatMap(g => g.stories);
    onStoriesUpdate(allStories);
  };

  if (!group || !story) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      {/* Close */}
      <button onClick={onClose}
        className="absolute top-4 right-4 z-20 w-9 h-9 glass rounded-full flex items-center justify-center">
        <Icon name="X" size={18} className="text-white" />
      </button>

      {/* Story container */}
      <div className="relative w-full max-w-sm h-full md:h-[90vh] md:rounded-3xl overflow-hidden select-none"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}>

        {/* Media */}
        {story.mediaType === "video" ? (
          <video src={story.mediaUrl} autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={story.mediaUrl} alt={story.caption}
            className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < storyIdx ? "100%" : i === storyIdx ? `${progress}%` : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-10">
          <img src={group.userAvatar} alt={group.userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/60" />
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">{group.userName}</div>
            <div className="text-white/60 text-xs">{story.createdAt}</div>
          </div>
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 flex z-10" style={{ pointerEvents: showComments ? "none" : "auto" }}>
          <div className="flex-1" onClick={goPrev} />
          <div className="flex-1" onClick={goNext} />
        </div>

        {/* Caption */}
        {story.caption && !showComments && (
          <div className="absolute bottom-24 left-4 right-4 z-10">
            <p className="text-white text-sm font-medium drop-shadow">{story.caption}</p>
          </div>
        )}

        {/* Bottom actions */}
        {!showComments && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 z-10">
            {/* Comment input trigger */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowComments(true); setTimeout(() => commentInputRef.current?.focus(), 100); }}
              className="flex-1 glass rounded-full px-4 py-2.5 text-white/50 text-sm text-left hover:bg-white/10 transition-all">
              Написать комментарий...
            </button>
            {/* Like */}
            <button onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className="w-11 h-11 glass rounded-full flex flex-col items-center justify-center gap-0.5">
              <Icon name={isLiked ? "Heart" : "Heart"} size={20}
                className={isLiked ? "text-pink-500 fill-pink-500" : "text-white"} />
              {story.likes.length > 0 && (
                <span className="text-white/60 text-[9px]">{story.likes.length}</span>
              )}
            </button>
          </div>
        )}

        {/* Comments panel */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-black/90 rounded-t-3xl pt-4 max-h-[60%] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="text-white font-semibold">Комментарии</h3>
              <button onClick={() => setShowComments(false)}
                className="w-7 h-7 glass rounded-full flex items-center justify-center">
                <Icon name="X" size={14} className="text-white/60" />
              </button>
            </div>
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-3">
              {story.comments.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">Пока нет комментариев</p>
              ) : (
                story.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <img src={c.userAvatar} alt={c.userName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 glass rounded-2xl px-3 py-2">
                      <div className="text-white/60 text-xs mb-0.5">{c.userName} · {c.sentAt}</div>
                      <div className="text-white text-sm">{c.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 flex gap-2">
              <img src={currentUserAvatar} alt={currentUserName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 flex gap-2">
                <input
                  ref={commentInputRef}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleComment()}
                  placeholder="Написать..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-full px-3 py-2 text-white text-sm outline-none focus:border-pink-500/50 placeholder:text-white/30"
                />
                <button onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="w-9 h-9 btn-gradient rounded-full flex items-center justify-center disabled:opacity-40">
                  <Icon name="Send" size={15} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Group navigation arrows (desktop) */}
      {groupIdx > 0 && (
        <button onClick={() => { setGroupIdx(g => g - 1); setStoryIdx(0); setProgress(0); }}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full items-center justify-center">
          <Icon name="ChevronLeft" size={20} className="text-white" />
        </button>
      )}
      {groupIdx < localGroups.length - 1 && (
        <button onClick={() => { setGroupIdx(g => g + 1); setStoryIdx(0); setProgress(0); }}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full items-center justify-center">
          <Icon name="ChevronRight" size={20} className="text-white" />
        </button>
      )}
    </div>
  );
}

export type { UserStoryGroup };
