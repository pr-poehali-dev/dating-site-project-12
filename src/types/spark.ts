export interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  city: string;
  distance?: number;
  rating: number;
  verified: boolean;
  premium: boolean;
  photos: string[];
  interests: string[];
  online: boolean;
  lastSeen?: string;
  stories?: Story[];
}

export interface Match {
  id: string;
  user: User;
  matchedAt: string;
  lastMessage?: Message;
  unread?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface StoryComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  sentAt: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  likes: string[];
  comments: StoryComment[];
  viewed: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'match' | 'message' | 'super_like' | 'visit';
  user: User;
  text: string;
  time: string;
  read: boolean;
}

export type AppScreen = 'landing' | 'auth' | 'app';
export type AppTab = 'discover' | 'matches' | 'chats' | 'notifications' | 'profile';