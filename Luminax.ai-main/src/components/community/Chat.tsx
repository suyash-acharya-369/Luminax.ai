import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Image as ImageIcon,
  FileText,
  Download,
  X,
  MoreHorizontal,
  ThumbsUp,
  Heart,
  Laugh,
  Upload,
  File,
  MessageCircle
} from "lucide-react";
import { ChatMessage, User } from '../../types/community';
import { fetchChatMessages, sendMessage, addReaction } from '../../services/communityService';

interface ChatProps {
  communityId: string;
  currentUserId: string;
}

const Chat: React.FC<ChatProps> = ({ communityId, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<Record<string, User>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const chatMessages = await fetchChatMessages(communityId);
        setMessages(chatMessages);
        
        // Load user data for all message authors
        const userIds = [...new Set(chatMessages.map(msg => msg.userId))];
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
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [communityId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Send text message if there's text
      if (newMessage.trim()) {
        const message = await sendMessage({
          communityId,
          userId: currentUserId,
          content: newMessage.trim(),
          type: 'text'
        });
        setMessages(prev => [...prev, message]);
      }

      // Send file messages for each uploaded file
      for (const file of uploadedFiles) {
        const fileMessage = await sendMessage({
          communityId,
          userId: currentUserId,
          content: `📎 ${file.name}`,
          type: file.type.startsWith('image/') ? 'image' : 'file'
        });
        setMessages(prev => [...prev, fileMessage]);
      }

      setNewMessage('');
      setUploadedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji, currentUserId);
      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.userIds.includes(currentUserId)) {
              // Remove reaction
              existingReaction.userIds = existingReaction.userIds.filter(id => id !== currentUserId);
            } else {
              // Add reaction
              existingReaction.userIds.push(currentUserId);
            }
          } else {
            // Add new reaction
            msg.reactions.push({ emoji, userIds: [currentUserId] });
          }
        }
        return msg;
      }));
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickReactions = ['👍', '❤️', '😂', '🎉'];

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col gradient-card border-border/50 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50">
        <CardTitle className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-lg font-semibold text-foreground">Community Chat</span>
          <Badge variant="secondary" className="ml-auto">
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 pb-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Start the conversation by sending a message!</p>
              </div>
            ) : (
              messages.map((message) => {
                const user = users[message.userId];
                const isCurrentUser = message.userId === currentUserId;
                
                return (
                  <div key={message.id} className={`flex gap-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {user?.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-[75%] ${isCurrentUser ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-foreground">
                          {user?.displayName || 'Unknown User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                    
                    <div className={`inline-block max-w-xs lg:max-w-md ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50 border border-border/50'
                    } rounded-lg overflow-hidden`}>
                      {message.type === 'image' ? (
                        <div className="p-2">
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{message.content}</span>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : message.type === 'file' ? (
                        <div className="p-2">
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{message.content}</span>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3">
                          <p className="text-sm text-foreground">{message.content}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                          >
                            <span className="mr-1">{reaction.emoji}</span>
                            <span>{reaction.userIds.length}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Quick Reactions */}
                    <div className="flex gap-1 mt-2">
                      {quickReactions.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleReaction(message.id, emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="border-t border-border/50 p-3 bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Files to upload:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-3 py-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground truncate max-w-32">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => removeUploadedFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-border/50 p-4 bg-card">
          <div className="flex gap-2">
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="pr-12"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleSendMessage}
              size="sm"
              disabled={(!newMessage.trim() && uploadedFiles.length === 0) || isUploading}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
