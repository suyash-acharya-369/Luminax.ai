import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Crown, 
  Shield, 
  User, 
  Trophy, 
  Flame, 
  Zap,
  Users,
  MessageCircle,
  Calendar
} from "lucide-react";
import { CommunityMember, User as UserType } from '../../types/community';
import { fetchCommunityMembers } from '../../services/communityService';

interface CommunityMembersProps {
  communityId: string;
  currentUserId: string;
}

const CommunityMembers: React.FC<CommunityMembersProps> = ({ communityId, currentUserId }) => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [users, setUsers] = useState<Record<string, UserType>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const communityMembers = await fetchCommunityMembers(communityId);
        setMembers(communityMembers);
        
        // Load user data for all members
        const userIds = [...new Set(communityMembers.map(member => member.userId))];
        const userPromises = userIds.map(async (userId) => {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            return response.json();
          }
          return null;
        });
        
        const userData = await Promise.all(userPromises);
        const userMap: Record<string, UserType> = {};
        userData.forEach((user, index) => {
          if (user) {
            userMap[userIds[index]] = user;
          }
        });
        setUsers(userMap);
      } catch (error) {
        console.error('Failed to load members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [communityId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'moderator': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredMembers = members.filter(member => {
    const user = users[member.userId];
    const matchesSearch = !searchQuery || 
      user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Sort members by role (admin first, then moderator, then members) and then by XP
  const sortedMembers = filteredMembers.sort((a, b) => {
    const roleOrder = { admin: 0, moderator: 1, member: 2 };
    const roleComparison = roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder];
    
    if (roleComparison !== 0) return roleComparison;
    return b.xp - a.xp;
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Members</h2>
          <p className="text-muted-foreground">{members.length} members in this community</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={roleFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter('all')}
          >
            All
          </Button>
          <Button
            variant={roleFilter === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter('admin')}
          >
            <Crown className="h-3 w-3 mr-1" />
            Admins
          </Button>
          <Button
            variant={roleFilter === 'moderator' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter('moderator')}
          >
            <Shield className="h-3 w-3 mr-1" />
            Mods
          </Button>
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {sortedMembers.map((member, index) => {
            const user = users[member.userId];
            const isCurrentUser = member.userId === currentUserId;
            
            return (
              <Card key={member.id} className={`${isCurrentUser ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                        {index + 1}
                      </div>
                      
                      {/* Avatar */}
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          {user?.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {user?.displayName || 'Unknown User'}
                            {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                          </h3>
                          <Badge className={`text-xs ${getRoleBadgeColor(member.role)}`}>
                            {getRoleIcon(member.role)}
                            <span className="ml-1 capitalize">{member.role}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          @{user?.username || 'unknown'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            <span>Level {member.level}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>{member.xp.toLocaleString()} XP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            <span>{member.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {formatJoinDate(member.joinedAt)}</span>
                        </div>
                      </div>
                      
                      {!isCurrentUser && (
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {sortedMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground">
              {searchQuery || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No members in this community yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityMembers;
