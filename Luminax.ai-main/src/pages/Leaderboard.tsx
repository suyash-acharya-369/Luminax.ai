import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Medal, Zap, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard, LeaderboardUser } from "@/supabase/quiz";
import { useMemo } from "react";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-xp-gold" />;
    case 2:
      return <Medal className="w-6 h-6 text-xp-silver" />;
    case 3:
      return <Trophy className="w-6 h-6 text-xp-bronze" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">#{rank}</span>;
  }
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-xp-gold text-white";
    case 2:
      return "bg-xp-silver text-white";
    case 3:
      return "bg-xp-bronze text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Leaderboard = () => {
  const { data: lbData, isLoading, error } = useQuery<{ data: LeaderboardUser[]; error: any }>({
    queryKey: ["leaderboard", "global"],
    queryFn: fetchLeaderboard,
  });

  const globalLeaderboard = useMemo(() => {
    const users = lbData?.data ?? [];
    return users.map((u, idx) => ({
      rank: idx + 1,
      name: u.username ?? u.id.slice(0, 6),
      xp: u.xp,
      community: "Your Community",
      streak: Math.max(1, 3 + ((u.xp ?? 0) % 17)),
      avatar: (u.username ?? "U").slice(0, 2).toUpperCase(),
    }));
  }, [lbData]);

  const communityLeaderboard = useMemo(() => {
    return globalLeaderboard.slice(0, 5).map(u => ({ rank: u.rank, name: u.name, xp: u.xp, streak: u.streak, avatar: u.avatar }));
  }, [globalLeaderboard]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-primary bg-clip-text text-transparent">
            Leaderboard
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Compete with the best learners across communities
        </p>
      </div>

      {isLoading && (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">Loading leaderboard...</CardContent>
        </Card>
      )}
      {error && (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6 text-destructive">Failed to load leaderboard.</CardContent>
        </Card>
      )}

      {/* Your Rank Card */}
      <Card className="gradient-card border-border/50 glow-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-xl font-bold text-white">
                YU
              </div>
              <div>
                <h3 className="text-xl font-bold">Your Current Rank</h3>
                <p className="text-muted-foreground">Keep climbing the ladder!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-bold text-primary">#10</span>
                <Badge className="gradient-primary text-primary-foreground">Level 12</Badge>
              </div>
              <p className="text-sm text-muted-foreground">1,250 XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Global Leaderboard
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Your Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>Top performers across all communities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                      user.name === "You"
                        ? "bg-primary/10 border border-primary/20 glow-primary"
                        : "bg-sidebar-accent hover:bg-sidebar-accent/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        <Badge className={getRankBadge(user.rank)}>
                          #{user.rank}
                        </Badge>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${user.name === "You" ? "text-primary" : ""}`}>
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.community}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">{user.xp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.streak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>JEE Legends Community</CardTitle>
              <CardDescription>Your community rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                      user.name === "You"
                        ? "bg-primary/10 border border-primary/20 glow-primary"
                        : "bg-sidebar-accent hover:bg-sidebar-accent/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        <Badge className={getRankBadge(user.rank)}>
                          #{user.rank}
                        </Badge>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${user.name === "You" ? "text-primary" : ""}`}>
                          {user.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">{user.xp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.streak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Challenge Section */}
      <Card className="gradient-hero border-border/50">
        <CardContent className="p-6 text-center">
          <Trophy className="w-16 h-16 text-xp-gold mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Weekly Challenge</h3>
          <p className="text-muted-foreground mb-4">
            Top 3 performers this week get exclusive badges and bonus XP!
          </p>
          <Button className="gradient-primary glow-primary">
            Join Challenge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;