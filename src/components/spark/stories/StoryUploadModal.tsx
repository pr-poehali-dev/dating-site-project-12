import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Story } from "@/types/spark";

interface Props {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onClose: () => void;
  onAdd: (story: Story) => void;
}

export default function StoryUploadModal({
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onClose,
  onAdd,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    setMediaType(isVideo ? "video" : "image");
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handlePublish = () => {
    if (!preview) return;
    setUploading(true);
    setTimeout(() => {
      const newStory: Story = {
        id: `s_${Date.now()}`,
        userId: currentUserId,
        userName: currentUserName,
        userAvatar: currentUserAvatar,
        mediaUrl: preview,
        mediaType,
        caption: caption.trim() || undefined,
        createdAt: "только что",
        likes: [],
        comments: [],
        viewed: false,
      };
      onAdd(newStory);
      setUploading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={18} className="text-pink-400" />
            <h2 className="text-white font-bold text-lg">Новая история</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white/60" />
          </button>
        </div>

        <div className="p-5">
          {/* Preview or Upload zone */}
          {preview ? (
            <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[9/16] max-h-64 bg-black">
              {mediaType === "video" ? (
                <video src={preview} autoPlay muted loop playsInline
                  className="w-full h-full object-cover" />
              ) : (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              )}
              <button onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                <Icon name="X" size={14} className="text-white" />
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-1">
                <Icon name={mediaType === "video" ? "Video" : "Image"} size={12} className="text-white/70" />
                <span className="text-white/70 text-[10px]">{mediaType === "video" ? "Видео" : "Фото"}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center gap-3 mb-4 hover:border-pink-500/40 hover:bg-white/5 transition-all">
              <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center">
                <Icon name="ImagePlus" size={28} className="text-white" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold mb-1">Добавить фото или видео</div>
                <div className="text-white/40 text-sm">JPG, PNG, MP4 · до 50 МБ</div>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            onChange={handleFile}
            className="hidden"
          />

          {/* Caption */}
          <div className="mb-4">
            <label className="text-white/40 text-xs mb-1.5 block">Подпись (необязательно)</label>
            <input
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Что происходит?"
              maxLength={100}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-pink-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!preview && (
              <button onClick={() => fileInputRef.current?.click()}
                className="flex-1 glass rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <Icon name="FolderOpen" size={16} className="text-white/60" />
                <span className="text-white/60 text-sm">Выбрать файл</span>
              </button>
            )}
            <button
              onClick={handlePublish}
              disabled={!preview || uploading}
              className="flex-1 btn-gradient text-white font-bold py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2">
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon name="Send" size={16} />
              )}
              {uploading ? "Публикую..." : "Опубликовать"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
