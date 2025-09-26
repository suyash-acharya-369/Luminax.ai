import { Community, User, CommunityMember, Resource, CommunityPost } from '../types/community';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alex_student',
    displayName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    level: 15,
    xp: 2450,
    streak: 12,
    badges: ['Early Bird', 'Quiz Master', 'Community Helper'],
    joinedAt: '2024-01-15',
    bio: 'Computer Science student passionate about AI and machine learning',
    subjects: ['Computer Science', 'Mathematics', 'Physics']
  },
  {
    id: '2',
    username: 'sarah_med',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    level: 22,
    xp: 3800,
    streak: 25,
    badges: ['Study Streak', 'Top Contributor', 'Mentor'],
    joinedAt: '2023-11-20',
    bio: 'Medical student helping others succeed in their studies',
    subjects: ['Medicine', 'Biology', 'Chemistry']
  },
  {
    id: '3',
    username: 'mike_eng',
    displayName: 'Mike Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    level: 18,
    xp: 3200,
    streak: 8,
    badges: ['Problem Solver', 'Team Player'],
    joinedAt: '2024-02-10',
    bio: 'Engineering student focused on sustainable technology',
    subjects: ['Engineering', 'Environmental Science', 'Mathematics']
  },
  {
    id: '4',
    username: 'emma_art',
    displayName: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    level: 12,
    xp: 1800,
    streak: 5,
    badges: ['Creative Mind', 'Study Buddy'],
    joinedAt: '2024-03-05',
    bio: 'Art history major with a love for Renaissance art',
    subjects: ['Art History', 'Literature', 'Philosophy']
  },
  {
    id: '5',
    username: 'david_bus',
    displayName: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    level: 20,
    xp: 3500,
    streak: 18,
    badges: ['Business Leader', 'Networker', 'Top Performer'],
    joinedAt: '2023-12-01',
    bio: 'Business student with entrepreneurial ambitions',
    subjects: ['Business', 'Economics', 'Marketing']
  }
];

export const mockCommunities: Community[] = [
  {
    id: 'cs-101',
    name: 'Computer Science Study Group',
    description: 'Join fellow CS students for coding challenges, algorithm discussions, and project collaborations.',
    category: 'Technology',
    memberCount: 1247,
    isPrivate: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    color: '#3B82F6',
    tags: ['Programming', 'Algorithms', 'Data Structures', 'AI'],
    createdAt: '2023-09-15',
    rules: [
      'Be respectful to all members',
      'Share helpful resources and code',
      'Ask questions and help others',
      'No spam or off-topic posts'
    ],
    moderators: ['1', '3']
  },
  {
    id: 'med-students',
    name: 'Medical Students United',
    description: 'A supportive community for medical students sharing study materials, clinical experiences, and exam prep.',
    category: 'Healthcare',
    memberCount: 892,
    isPrivate: false,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
    color: '#10B981',
    tags: ['Medicine', 'Anatomy', 'Physiology', 'Clinical'],
    createdAt: '2023-08-20',
    rules: [
      'Maintain patient confidentiality',
      'Share accurate medical information only',
      'Support fellow students',
      'Respect professional boundaries'
    ],
    moderators: ['2']
  },
  {
    id: 'engineering-masters',
    name: 'Engineering Masters',
    description: 'Advanced engineering discussions, project showcases, and career guidance for engineering students.',
    category: 'Engineering',
    memberCount: 654,
    isPrivate: false,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop',
    color: '#F59E0B',
    tags: ['Mechanical', 'Electrical', 'Civil', 'Software'],
    createdAt: '2023-10-01',
    rules: [
      'Share engineering projects and solutions',
      'Provide constructive feedback',
      'Help with technical problems',
      'Respect intellectual property'
    ],
    moderators: ['3', '5']
  },
  {
    id: 'art-history',
    name: 'Art History Enthusiasts',
    description: 'Explore art movements, discuss famous works, and share cultural insights with fellow art lovers.',
    category: 'Arts',
    memberCount: 423,
    isPrivate: false,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop',
    color: '#8B5CF6',
    tags: ['Renaissance', 'Modern Art', 'Sculpture', 'Museums'],
    createdAt: '2024-01-10',
    rules: [
      'Share high-quality art images',
      'Provide historical context',
      'Respect different art perspectives',
      'Cite sources when discussing art'
    ],
    moderators: ['4']
  },
  {
    id: 'business-leaders',
    name: 'Future Business Leaders',
    description: 'Networking, case studies, and business strategy discussions for aspiring entrepreneurs and business students.',
    category: 'Business',
    memberCount: 756,
    isPrivate: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
    color: '#EF4444',
    tags: ['Entrepreneurship', 'Finance', 'Marketing', 'Strategy'],
    createdAt: '2023-11-05',
    rules: [
      'Share business insights and experiences',
      'Network professionally',
      'Provide constructive business advice',
      'Respect confidentiality'
    ],
    moderators: ['5', '2']
  }
];

export const mockCommunityMembers: CommunityMember[] = [
  { id: '1', userId: '1', communityId: 'cs-101', role: 'admin', joinedAt: '2023-09-15', xp: 2450, level: 15, streak: 12 },
  { id: '2', userId: '2', communityId: 'med-students', role: 'admin', joinedAt: '2023-08-20', xp: 3800, level: 22, streak: 25 },
  { id: '3', userId: '3', communityId: 'engineering-masters', role: 'admin', joinedAt: '2023-10-01', xp: 3200, level: 18, streak: 8 },
  { id: '4', userId: '4', communityId: 'art-history', role: 'admin', joinedAt: '2024-01-10', xp: 1800, level: 12, streak: 5 },
  { id: '5', userId: '5', communityId: 'business-leaders', role: 'admin', joinedAt: '2023-11-05', xp: 3500, level: 20, streak: 18 },
  // Additional members
  { id: '6', userId: '1', communityId: 'engineering-masters', role: 'member', joinedAt: '2023-10-15', xp: 1200, level: 8, streak: 3 },
  { id: '7', userId: '2', communityId: 'business-leaders', role: 'member', joinedAt: '2023-11-10', xp: 800, level: 6, streak: 2 },
  { id: '8', userId: '3', communityId: 'cs-101', role: 'member', joinedAt: '2023-09-20', xp: 1500, level: 10, streak: 7 },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    communityId: 'cs-101',
    userId: '1',
    title: 'Data Structures Cheat Sheet',
    description: 'Comprehensive guide to common data structures with examples',
    type: 'pdf',
    url: '/resources/data-structures-cheat-sheet.pdf',
    fileName: 'data-structures-cheat-sheet.pdf',
    fileSize: 2048576,
    uploadedAt: '2024-01-15',
    downloads: 234,
    tags: ['Data Structures', 'Algorithms', 'Reference']
  },
  {
    id: '2',
    communityId: 'med-students',
    userId: '2',
    title: 'Anatomy Study Guide - Cardiovascular System',
    description: 'Detailed study guide for cardiovascular anatomy with diagrams',
    type: 'pdf',
    url: '/resources/cardiovascular-anatomy.pdf',
    fileName: 'cardiovascular-anatomy.pdf',
    fileSize: 5120000,
    uploadedAt: '2024-01-10',
    downloads: 189,
    tags: ['Anatomy', 'Cardiovascular', 'Study Guide']
  },
  {
    id: '3',
    communityId: 'cs-101',
    userId: '1',
    title: 'Python Algorithms Tutorial',
    description: 'Step-by-step tutorial on implementing common algorithms in Python',
    type: 'video',
    url: 'https://youtube.com/watch?v=example',
    uploadedAt: '2024-01-12',
    downloads: 156,
    tags: ['Python', 'Algorithms', 'Tutorial']
  }
];

export const mockPosts: CommunityPost[] = [
  {
    id: '1',
    communityId: 'cs-101',
    userId: '1',
    title: 'Best practices for code reviews?',
    content: 'I\'m working on improving my code review process. What are some best practices you follow when reviewing code?',
    type: 'question',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    likes: 23,
    comments: 8,
    isPinned: false,
    tags: ['Code Review', 'Best Practices']
  },
  {
    id: '2',
    communityId: 'med-students',
    userId: '2',
    title: 'Anatomy Lab Tips',
    content: 'Sharing some tips that helped me excel in anatomy lab. Focus on understanding relationships between structures!',
    type: 'discussion',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    likes: 45,
    comments: 12,
    isPinned: true,
    tags: ['Anatomy', 'Study Tips', 'Lab']
  }
];

export const mockChatMessages: any[] = [
  {
    id: '1',
    communityId: 'cs-101',
    userId: '1',
    content: 'Hey everyone! Just finished implementing a binary search tree. Anyone want to review my code?',
    timestamp: '2024-01-20T10:30:00Z',
    type: 'text',
    reactions: [{ emoji: '👍', userIds: ['2', '3'] }]
  },
  {
    id: '2',
    communityId: 'cs-101',
    userId: '2',
    content: 'Sure! I\'d love to help. Can you share the code?',
    timestamp: '2024-01-20T10:32:00Z',
    type: 'text',
    reactions: []
  },
  {
    id: '3',
    communityId: 'med-students',
    userId: '2',
    content: 'Quick question: What\'s the best way to memorize the cranial nerves?',
    timestamp: '2024-01-20T09:15:00Z',
    type: 'text',
    reactions: [{ emoji: '🤔', userIds: ['4'] }]
  }
];
