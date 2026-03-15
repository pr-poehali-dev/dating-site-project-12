import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Story } from "@/types/spark";
import StoriesViewer, { UserStoryGroup } from "./StoriesViewer";
import StoryUploadModal from "./StoryUploadModal";

interface Props {
  stories: Story[];
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onStoriesUpdate: (stories: Story[]) => void;
}

function groupStoriesByUser(stories: Story[]): UserStoryGroup[] {
  const map = new Map<string, UserStoryGroup>();
  for (const story of stories) {
    if (!map.has(story.userId)) {
      map.set(story.userId, {
        userId: story.userId,
        userName: story.userName,
        userAvatar: story.userAvatar,
        stories: [],
      });
    }
    map.get(story.userId)!.stories.push(story);
  }
  return Array.from(map.values());
}

export default function StoriesRow({
  stories,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onStoriesUpdate,
}: Props) {
  const [viewerGroupIdx, setViewerGroupIdx] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const groups = groupStoriesByUser(stories.filter(s => s.userId !== currentUserId));
  const myStories = stories.filter(s => s.userId === currentUserId);
  const hasMyStory = myStories.length > 0;

  const allGroups: UserStoryGroup[] = [
    ...(hasMyStory ? [{
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      stories: myStories,
    }] : []),
    ...groups,
  ];

  const openGroup = (groupIdx: number) => {
    setViewerGroupIdx(groupIdx);
  };

  const isGroupViewed = (g: UserStoryGroup) => g.stories.every(s => s.viewed);

  return (
    <>
      <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide flex-shrink-0">

        {/* My story button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <button
            onClick={() => hasMyStory ? openGroup(0) : setShowUpload(true)}
            className="relative w-14 h-14 rounded-full"
          >
            {hasMyStory ? (
              <div className={`story-ring w-14 h-14 ${isGroupViewed({ userId: currentUserId, userName: currentUserName, userAvatar: currentUserAvatar, stories: myStories }) ? "opacity-50" : ""}`}>
                <img src={currentUserAvatar} alt={currentUserName}
                  className="w-full h-full rounded-full object-cover border-2 border-background" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
                <Icon name="Plus" size={20} className="text-white/40" />
              </div>
            )}
            {/* Add button overlay */}
            {hasMyStory && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowUpload(true); }}
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 btn-gradient rounded-full flex items-center justify-center border border-background z-10">
                <Icon name="Plus" size={10} className="text-white" />
              </button>
            )}
          </button>
          <span className="text-white/40 text-[10px]">Моя</span>
        </div>

        {/* Other users stories */}
        {groups.map((group, i) => {
          const viewed = isGroupViewed(group);
          const groupIndexInAll = hasMyStory ? i + 1 : i;
          return (
            <div key={group.userId} className="flex-shrink-0 flex flex-col items-center gap-1">
              <button
                onClick={() => openGroup(groupIndexInAll)}
                className={`story-ring w-14 h-14 transition-opacity ${viewed ? "opacity-50" : ""}`}>
                <img src={group.userAvatar} alt={group.userName}
                  className="w-full h-full rounded-full object-cover border-2 border-background" />
              </button>
              <span className="text-white/50 text-[10px]">{group.userName.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>

      {viewerGroupIdx !== null && (
        <StoriesViewer
          groups={allGroups}
          initialGroupIndex={viewerGroupIdx}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserAvatar={currentUserAvatar}
          onClose={() => setViewerGroupIdx(null)}
          onStoriesUpdate={onStoriesUpdate}
        />
      )}

      {showUpload && (
        <StoryUploadModal
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserAvatar={currentUserAvatar}
          onClose={() => setShowUpload(false)}
          onAdd={(story) => {
            onStoriesUpdate([...stories, story]);
            setShowUpload(false);
          }}
        />
      )}
    </>
  );
}
