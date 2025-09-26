import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Users, Trophy, BookOpen, Target, Flame, MessageCircle, FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCommunities } from '../data/mockData';

const Home = () => {
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    console.log("Navigating to community...");
    navigate('/community');
  };

  const handleWatchDemo = () => {
    console.log("Navigating to study...");
    navigate('/study');
  };

  const handleStartJourney = () => {
    console.log("Starting journey...");
    navigate('/study');
  };

  const handleJoinSpecificCommunity = (communityId: string) => {
    console.log(`Joining community ${communityId}...`);
    navigate(`/community?join=${communityId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="gradient-secondary mb-6 text-secondary-foreground px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Welcome to the Future of Learning
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Luminax AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Where studying feels like gaming. Join thousands of students turning their education 
              into an epic adventure with XP, achievements, and competitive learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="gradient-primary glow-primary text-lg px-8 py-6"
                onClick={handleJoinCommunity}
              >
                Join Your Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Join Your Study Community
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with students in your field
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {mockCommunities.slice(0, 6).map((community) => (
              <Card key={community.id} className="bg-white border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br from-purple-500 to-indigo-500 group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300"
                    >
                      {community.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1 text-gray-800">{community.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                          {community.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {community.memberCount.toLocaleString()} members
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    {community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {community.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1 border-purple-200 text-purple-600 hover:bg-purple-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleJoinSpecificCommunity(community.id)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Join Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleJoinCommunity}
              className="text-base px-6 py-3 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-300"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View All Communities
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Level Up Your{" "}
              <span className="gradient-secondary bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Transform boring study sessions into engaging gaming experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="gradient-card border-border/50 hover:glow-primary transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 glow-primary">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Earn XP, unlock achievements, and level up as you study. Every quiz, discussion, and completed task rewards you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-border/50 hover:glow-secondary transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mb-4 glow-secondary">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Study Communities</CardTitle>
                <CardDescription>
                  Join class-specific groups, compete with peers, and learn together in supportive communities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-border/50 hover:glow-success transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mb-4 glow-success">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI-Powered Quizzes</CardTitle>
                <CardDescription>
                  Get personalized quizzes generated by AI based on your subjects and learning progress.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Studies?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who've made learning their favorite game
          </p>
          <Button 
            size="lg" 
            className="gradient-primary glow-primary text-lg px-8 py-6"
            onClick={handleStartJourney}
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;