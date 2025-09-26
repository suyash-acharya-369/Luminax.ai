import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Users, 
  MessageCircle, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Filter,
  Crown,
  Shield,
  User,
  Calendar,
  Eye,
  Download,
  Heart,
  MessageSquare,
  TrendingUp,
  Zap,
  Flame,
  Trophy,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Community, User as UserType, CommunityPost, Resource } from '../types/community';
import { 
  fetchCommunities, 
  joinCommunity, 
  leaveCommunity, 
  fetchCommunityPosts, 
  createPost,
  fetchCommunityResources 
} from '../services/communityService';
import Chat from '../components/community/Chat';
import ResourceManager from '../components/community/ResourceManager';
import CommunityMembers from '../components/community/CommunityMembers';

const Community = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentUserId] = useState('1'); // Mock current user ID
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set(['cs-101', 'med-students'])); // Mock joined communities

  useEffect(() => {
    const loadCommunities = async () => {
      setIsLoading(true);
      try {
        const communityData = await fetchCommunities();
        setCommunities(communityData);
        if (communityData.length > 0) {
          setSelectedCommunity(communityData[0]);
        }
      } catch (error) {
        console.error('Failed to load communities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunities();
  }, []);

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await joinCommunity(communityId, currentUserId);
      // Update local state
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { ...community, memberCount: community.memberCount + 1 }
          : community
      ));
      // Add to joined communities
      setJoinedCommunities(prev => new Set([...prev, communityId]));
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      await leaveCommunity(communityId, currentUserId);
      // Update local state
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { ...community, memberCount: community.memberCount - 1 }
          : community
      ));
      // Remove from joined communities
      setJoinedCommunities(prev => {
        const newSet = new Set(prev);
        newSet.delete(communityId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to leave community:', error);
    }
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || community.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(communities.map(community => community.category))];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">
          Study Communities
        </h1>
        <p className="text-base text-muted-foreground">
          Connect with fellow students and learn together
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
            className="flex-shrink-0"
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Communities Sidebar - Moved to Top */}
      <Card className="mb-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                <Users className="h-5 w-5" />
                Communities
              </CardTitle>
              <CardDescription className="mt-1">
                {filteredCommunities.length} communities available
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedCommunity?.id === community.id 
                    ? 'border-purple-400 bg-purple-100/50 shadow-md' 
                    : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedCommunity(community)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: community.color }}
                  >
                    {community.name.charAt(0)}
                  </div>
                  
                  <div className="w-full">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{community.name}</h3>
                    <Badge variant="secondary" className="text-xs mb-1 bg-purple-100 text-purple-700 border-purple-200">
                      {community.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {community.memberCount.toLocaleString()} members
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Community Details - Full Width */}
      <div className="w-full">
        {selectedCommunity ? (
          <div className="space-y-4">
            {/* Community Header */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                      style={{ backgroundColor: selectedCommunity.color }}
                    >
                      {selectedCommunity.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <CardTitle className="text-lg line-clamp-1">{selectedCommunity.name}</CardTitle>
                        {joinedCommunities.has(selectedCommunity.id) && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 w-fit">
                            <Users className="h-3 w-3 mr-1" />
                            Joined
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Badge variant="secondary" className="text-xs w-fit bg-purple-100 text-purple-700 border-purple-200">
                          {selectedCommunity.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {selectedCommunity.memberCount.toLocaleString()} members
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    {joinedCommunities.has(selectedCommunity.id) ? (
                      <>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveCommunity(selectedCommunity.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Leave
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white w-full sm:w-auto"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleJoinCommunity(selectedCommunity.id)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Joined Communities Section */}
            {joinedCommunities.size > 0 && (
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Users className="h-5 w-5" />
                    Your Joined Communities
                  </CardTitle>
                  <CardDescription>
                    You're a member of {joinedCommunities.size} communities
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {Array.from(joinedCommunities).map(communityId => {
                      const community = communities.find(c => c.id === communityId);
                      if (!community) return null;
                      
                      return (
                        <div key={communityId} className="flex flex-col items-center gap-2 p-2 bg-white border border-purple-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: community.color }}
                          >
                            {community.name.charAt(0)}
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-xs line-clamp-1">{community.name}</p>
                            <p className="text-xs text-muted-foreground">{community.category}</p>
                          </div>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedCommunity(community)}
                            className="h-6 px-2 text-xs"
                          >
                            View
                          </Button>
                        </div>
                      );
                    })}
              </div>
                </CardContent>
              </Card>
            )}

            {/* Community Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="chat" className="text-xs sm:text-sm">Chat</TabsTrigger>
                <TabsTrigger value="resources" className="text-xs sm:text-sm">Resources</TabsTrigger>
                <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Community Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Members</span>
                        <span className="font-semibold">{selectedCommunity.memberCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="secondary">{selectedCommunity.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm">{new Date(selectedCommunity.createdAt).toLocaleDateString()}</span>
                      </div>
            </CardContent>
          </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Community Rules
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {selectedCommunity.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary flex-shrink-0">•</span>
                            <span className="break-words">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New discussion started</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Plus className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New member joined</p>
                          <p className="text-xs text-muted-foreground">4 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                          <p className="text-sm font-medium">Resource uploaded</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                </div>
              </div>
            </CardContent>
          </Card>
              </TabsContent>
              
              <TabsContent value="chat">
                <Chat 
                  communityId={selectedCommunity.id} 
                  currentUserId={currentUserId} 
                />
              </TabsContent>
              
              <TabsContent value="resources">
                <ResourceManager 
                  communityId={selectedCommunity.id} 
                  currentUserId={currentUserId} 
                />
              </TabsContent>
              
              <TabsContent value="members">
                <CommunityMembers 
                  communityId={selectedCommunity.id} 
                  currentUserId={currentUserId} 
                />
              </TabsContent>
            </Tabs>
                </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Community</h3>
              <p className="text-muted-foreground">
                Choose a community from the list to view details and join
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Community;