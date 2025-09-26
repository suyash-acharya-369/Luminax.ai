import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Trophy, 
  Flame, 
  Zap, 
  Calendar, 
  BookOpen, 
  Target, 
  Medal,
  Crown,
  Edit
} from "lucide-react";

const achievements = [
  { 
    id: 1, 
    name: "First Steps", 
    description: "Complete your first quiz", 
    icon: Target, 
    color: "bg-xp-bronze", 
    earned: true 
  },
  { 
    id: 2, 
    name: "Week Warrior", 
    description: "Maintain 7-day study streak", 
    icon: Flame, 
    color: "bg-warning", 
    earned: true 
  },
  { 
    id: 3, 
    name: "Quiz Master", 
    description: "Complete 50 quizzes with 90%+ score", 
    icon: Crown, 
    color: "bg-xp-gold", 
    earned: true 
  },
  { 
    id: 4, 
    name: "Speed Demon", 
    description: "Complete quiz in under 30 seconds", 
    icon: Zap, 
    color: "bg-primary", 
    earned: false 
  },
  { 
    id: 5, 
    name: "Perfect Score", 
    description: "Score 100% on any quiz", 
    icon: Trophy, 
    color: "bg-success", 
    earned: true 
  },
  { 
    id: 6, 
    name: "Community Leader", 
    description: "Reach top 10 in your community", 
    icon: Medal, 
    color: "bg-xp-diamond", 
    earned: false 
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Completed quiz",
    subject: "Mathematics - Quadratic Equations",
    xp: 75,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    action: "Earned achievement", 
    subject: "Quiz Master",
    xp: 100,
    timestamp: "1 day ago"
  },
  {
    id: 3,
    action: "Completed daily quest",
    subject: "Physics - Momentum",
    xp: 50,
    timestamp: "1 day ago"
  },
  {
    id: 4,
    action: "Joined community",
    subject: "JEE Legends",
    xp: 25,
    timestamp: "3 days ago"
  }
];

const Profile = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Your{" "}
          <span className="gradient-primary bg-clip-text text-transparent">
            Profile
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Track your achievements and learning journey
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center text-3xl font-bold text-white glow-primary">
              YU
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h2 className="text-2xl font-bold">Your Name</h2>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
              <p className="text-muted-foreground mb-3">JEE Aspirant • Member since March 2024</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="gradient-primary text-primary-foreground">Level 12</Badge>
                <Badge variant="outline">JEE Legends Community</Badge>
                <Badge className="bg-warning text-white">🔥 7 Day Streak</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">1,250</div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <div className="mt-2">
                <div className="text-lg font-semibold text-secondary">#10</div>
                <p className="text-xs text-muted-foreground">Global Rank</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="gradient-card border-border/50 text-center">
          <CardContent className="p-6">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-primary mb-1">115</div>
            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 text-center">
          <CardContent className="p-6">
            <Trophy className="w-8 h-8 text-xp-gold mx-auto mb-3" />
            <div className="text-2xl font-bold text-xp-gold mb-1">23</div>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 text-center">
          <CardContent className="p-6">
            <Target className="w-8 h-8 text-secondary mx-auto mb-3" />
            <div className="text-2xl font-bold text-secondary mb-1">89%</div>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 text-center">
          <CardContent className="p-6">
            <Calendar className="w-8 h-8 text-success mx-auto mb-3" />
            <div className="text-2xl font-bold text-success mb-1">45</div>
            <p className="text-sm text-muted-foreground">Days Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Achievement Gallery</CardTitle>
              <CardDescription>Your learning milestones and badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      achievement.earned
                        ? "border-primary/20 bg-primary/5 glow-primary"
                        : "border-muted bg-muted/20 opacity-60"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 ${
                          achievement.earned ? achievement.color : "bg-muted"
                        } rounded-full flex items-center justify-center mx-auto mb-3 ${
                          achievement.earned ? "glow-primary" : ""
                        }`}
                      >
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.earned ? (
                        <Badge className="mt-2 bg-success text-white">Earned</Badge>
                      ) : (
                        <Badge variant="outline" className="mt-2">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning actions and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-sidebar-accent rounded-lg">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.subject}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="gradient-primary text-primary-foreground">
                        +{activity.xp} XP
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;