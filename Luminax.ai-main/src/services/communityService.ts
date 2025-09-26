import { Community, User, CommunityMember, Resource, CommunityPost, ChatMessage } from '../types/community';
import { mockCommunities, mockUsers, mockCommunityMembers, mockResources, mockPosts, mockChatMessages } from '../data/mockData';

// Community Management
export const fetchCommunities = async (): Promise<Community[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCommunities;
};

export const fetchCommunityById = async (id: string): Promise<Community | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCommunities.find(community => community.id === id) || null;
};

export const joinCommunity = async (communityId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  // In a real app, this would make an API call
  console.log(`User ${userId} joined community ${communityId}`);
  return true;
};

export const leaveCommunity = async (communityId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`User ${userId} left community ${communityId}`);
  return true;
};

// User Management
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockUsers;
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers.find(user => user.id === id) || null;
};

export const fetchCommunityMembers = async (communityId: string): Promise<CommunityMember[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockCommunityMembers.filter(member => member.communityId === communityId);
};

// Resources
export const fetchCommunityResources = async (communityId: string): Promise<Resource[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockResources.filter(resource => resource.communityId === communityId);
};

export const uploadResource = async (resource: Omit<Resource, 'id' | 'uploadedAt' | 'downloads'>): Promise<Resource> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newResource: Resource = {
    ...resource,
    id: Date.now().toString(),
    uploadedAt: new Date().toISOString(),
    downloads: 0
  };
  console.log('Resource uploaded:', newResource);
  return newResource;
};

export const downloadResource = async (resourceId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Resource ${resourceId} downloaded`);
  return true;
};

// Posts and Discussions
export const fetchCommunityPosts = async (communityId: string): Promise<CommunityPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPosts.filter(post => post.communityId === communityId);
};

export const createPost = async (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): Promise<CommunityPost> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newPost: CommunityPost = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    comments: 0
  };
  console.log('Post created:', newPost);
  return newPost;
};

export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`User ${userId} liked post ${postId}`);
  return true;
};

// Chat System
export const fetchChatMessages = async (communityId: string): Promise<ChatMessage[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockChatMessages.filter(message => message.communityId === communityId);
};

export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp' | 'reactions'>): Promise<ChatMessage> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newMessage: ChatMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    reactions: []
  };
  console.log('Message sent:', newMessage);
  return newMessage;
};

export const addReaction = async (messageId: string, emoji: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`User ${userId} added reaction ${emoji} to message ${messageId}`);
  return true;
};

// Search and Filter
export const searchCommunities = async (query: string): Promise<Community[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const filtered = mockCommunities.filter(community => 
    community.name.toLowerCase().includes(query.toLowerCase()) ||
    community.description.toLowerCase().includes(query.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  return filtered;
};

export const filterCommunitiesByCategory = async (category: string): Promise<Community[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockCommunities.filter(community => community.category === category);
};
