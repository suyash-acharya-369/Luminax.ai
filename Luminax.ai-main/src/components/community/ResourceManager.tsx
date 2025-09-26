import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, 
  Download, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Link as LinkIcon,
  File,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar
} from "lucide-react";
import { Resource, User } from '../../types/community';
import { fetchCommunityResources, uploadResource, downloadResource } from '../../services/communityService';

interface ResourceManagerProps {
  communityId: string;
  currentUserId: string;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ communityId, currentUserId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [users, setUsers] = useState<Record<string, User>>({});

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'document' as Resource['type'],
    url: '',
    tags: ''
  });

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        const communityResources = await fetchCommunityResources(communityId);
        setResources(communityResources);
        
        // Load user data
        const userIds = [...new Set(communityResources.map(resource => resource.userId))];
        const userPromises = userIds.map(async (userId) => {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            return response.json();
          }
          return null;
        });
        
        const userData = await Promise.all(userPromises);
        const userMap: Record<string, User> = {};
        userData.forEach((user, index) => {
          if (user) {
            userMap[userIds[index]] = user;
          }
        });
        setUsers(userMap);
      } catch (error) {
        console.error('Failed to load resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, [communityId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newResource = await uploadResource({
        communityId,
        userId: currentUserId,
        title: uploadForm.title,
        description: uploadForm.description,
        type: uploadForm.type,
        url: uploadForm.url,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      
      setResources(prev => [newResource, ...prev]);
      setShowUploadForm(false);
      setUploadForm({
        title: '',
        description: '',
        type: 'document',
        url: '',
        tags: ''
      });
    } catch (error) {
      console.error('Failed to upload resource:', error);
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      await downloadResource(resourceId);
      // Update download count locally
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, downloads: resource.downloads + 1 }
          : resource
      ));
    } catch (error) {
      console.error('Failed to download resource:', error);
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      case 'pdf': return <File className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || resource.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading resources...</p>
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
          <h2 className="text-2xl font-bold">Resources</h2>
          <p className="text-muted-foreground">Share and discover study materials</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Resource</CardTitle>
            <CardDescription>Share a file, video, or link with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter resource title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the resource"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={uploadForm.type} onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value as Resource['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="url">URL or File Path</Label>
                <Input
                  id="url"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com or /path/to/file"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="study-guide, tutorial, reference"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Upload</Button>
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
            <SelectItem value="link">Links</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => {
          const user = users[resource.userId];
          
          return (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getResourceIcon(resource.type)}
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(resource.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardDescription className="line-clamp-2">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{resource.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(resource.uploadedAt)}</span>
                      </div>
                    </div>
                    
                    {resource.fileSize && (
                      <span>{formatFileSize(resource.fileSize)}</span>
                    )}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-muted-foreground">
                      by {user?.displayName || 'Unknown User'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to share a resource with the community'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button onClick={() => setShowUploadForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceManager;
