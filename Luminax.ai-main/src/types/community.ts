export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  image: string;
  color: string;
  tags: string[];
  createdAt: string;
  rules: string[];
  moderators: string[];
}

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  xp: number;
  level: number;
  streak: number;
}

export interface ChatMessage {
  id: string;
  communityId: string;
  userId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  replyTo?: string;
  reactions: { emoji: string; userIds: string[] }[];
}

export interface Resource {
  id: string;
  communityId: string;
  userId: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'image' | 'link' | 'pdf';
  url: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt: string;
  downloads: number;
  tags: string[];
}

export interface CommunityPost {
  id: string;
  communityId: string;
  userId: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'announcement' | 'resource';
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  isPinned: boolean;
  tags: string[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  joinedAt: string;
  bio?: string;
  subjects: string[];
}
