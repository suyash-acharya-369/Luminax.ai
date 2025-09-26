import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { TrendingUp, Trophy, Flame, Zap, Target, BookOpen } from "lucide-react";

const Progress = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Your{" "}
          <span className="gradient-primary bg-clip-text text-transparent">
            Progress
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Track your learning journey and celebrate achievements
        </p>
      </div>

      {/* XP and Level Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="gradient-card border-border/50 glow-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Total XP
              </CardTitle>
              <Badge className="gradient-primary text-primary-foreground">
                Level 12
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary">1,250 XP</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level 13</span>
                  <span>750/1000</span>
                </div>
                <ProgressBar value={75} className="xp-glow" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 glow-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning streak-animation" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-warning">7 Days</div>
              <p className="text-sm text-muted-foreground">
                Your longest streak: 15 days
              </p>
              <Badge className="bg-warning text-white">
                Keep it burning! 🔥
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 hover:glow-secondary transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-xp-gold" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-xp-gold">23</div>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-xp-bronze text-white text-xs">First Quiz</Badge>
                <Badge className="bg-xp-silver text-white text-xs">Week Warrior</Badge>
                <Badge className="bg-xp-gold text-white text-xs">Quiz Master</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Progress */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Subject Progress
          </CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Mathematics</p>
                    <p className="text-sm text-muted-foreground">42 quizzes completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">850 XP</p>
                  <p className="text-sm text-muted-foreground">92% avg</p>
                </div>
              </div>
              <ProgressBar value={85} className="glow-primary" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">P</span>
                  </div>
                  <div>
                    <p className="font-medium">Physics</p>
                    <p className="text-sm text-muted-foreground">38 quizzes completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary">720 XP</p>
                  <p className="text-sm text-muted-foreground">88% avg</p>
                </div>
              </div>
              <ProgressBar value={72} className="glow-secondary" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">C</span>
                  </div>
                  <div>
                    <p className="font-medium">Chemistry</p>
                    <p className="text-sm text-muted-foreground">35 quizzes completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">680 XP</p>
                  <p className="text-sm text-muted-foreground">85% avg</p>
                </div>
              </div>
              <ProgressBar value={68} className="glow-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance Chart */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly XP Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end justify-between gap-2">
            {[120, 80, 150, 200, 100, 180, 220].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div 
                  className="w-full gradient-primary rounded-t glow-primary"
                  style={{ height: `${(value / 220) * 100}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total this week: <span className="text-primary font-semibold">1,050 XP</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-sidebar-accent rounded-lg">
              <div className="w-10 h-10 bg-xp-gold rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Quiz Master</p>
                <p className="text-sm text-muted-foreground">Complete 50 quizzes with 90%+ score</p>
              </div>
              <Badge className="bg-xp-gold text-white">+100 XP</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-sidebar-accent rounded-lg">
              <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Week Warrior</p>
                <p className="text-sm text-muted-foreground">Maintain 7-day study streak</p>
              </div>
              <Badge className="bg-warning text-white">+75 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;