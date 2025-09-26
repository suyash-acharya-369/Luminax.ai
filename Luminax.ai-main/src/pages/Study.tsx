import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Clock, Target, CheckCircle, Flame } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchQuizzes, submitResult, QuizItem } from "@/supabase/quiz";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Study = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: quizResp, isLoading: quizzesLoading } = useQuery<{ data: QuizItem[]; error: any}>({
    queryKey: ["quizzes", { topic: "General" }],
    queryFn: () => fetchQuizzes("General", 5),
  });

  const quizzes = useMemo(() => quizResp?.data ?? [], [quizResp]);

  const submitMutation = useMutation({
    mutationFn: (args: { userId: string; quizId: number; score: number }) => submitResult(args.userId, args.quizId, args.score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  const handleSubmit = (quizId: number) => {
    // Placeholder user id; replace with real auth session user id when available
    const userId = "anonymous-user";
    submitMutation.mutate({ userId, quizId, score: 10 });
  };

  const handleGenerateQuiz = () => {
    // Refresh quizzes
    queryClient.invalidateQueries({ queryKey: ["quizzes"] });
  };

  const handleStartTest = () => {
    navigate('/study');
  };

  const handleQuickFire = () => {
    alert('Starting Quick Fire quiz!');
  };

  const handleMemoryPalace = () => {
    alert('Starting Memory Palace practice!');
  };

  const handleReview = () => {
    alert('Starting review session!');
  };

  const handleContinueQuest = () => {
    alert('Continuing daily quest!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Study{" "}
          <span className="gradient-secondary bg-clip-text text-transparent">
            Hub
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered quizzes, daily quests, and study challenges
        </p>
      </div>

      {/* Daily Quest */}
      <Card className="gradient-card border-border/50 glow-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-warning streak-animation" />
              Daily Quest
            </CardTitle>
            <Badge className="gradient-secondary text-secondary-foreground">
              +100 XP
            </Badge>
          </div>
          <CardDescription>
            Complete today's challenge to maintain your streak!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Mathematics - Quadratic Equations</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-muted rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{width: "60%"}}></div>
                </div>
                <span className="text-sm text-muted-foreground">3/5</span>
              </div>
            </div>
            <Button 
              className="w-full gradient-secondary glow-secondary"
              onClick={handleContinueQuest}
            >
              Continue Quest
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Quiz Generator */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="gradient-card border-border/50 hover:glow-primary transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>AI Quiz Generator</CardTitle>
                <CardDescription>Custom quizzes based on your subjects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Physics</Badge>
                <Badge variant="outline">Chemistry</Badge>
                <Badge variant="outline">Math</Badge>
                <Badge variant="outline">+3 more</Badge>
              </div>
              <Button 
                className="w-full gradient-primary glow-primary" 
                disabled={quizzesLoading} 
                onClick={handleGenerateQuiz}
              >
                {quizzesLoading ? "Loading..." : "Generate Quiz"}
              </Button>
              {quizzes.length > 0 && (
                <div className="mt-4 space-y-2">
                  {quizzes.map(q => (
                    <div key={q.id} className="flex items-center justify-between bg-sidebar-accent p-3 rounded">
                      <span className="font-medium">Quiz #{q.id} - {q.topic}</span>
                      <Button 
                        size="sm" 
                        onClick={() => handleSubmit(q.id)} 
                        disabled={submitMutation.isPending}
                      >
                        Submit 10 XP
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 hover:glow-success transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center glow-success">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Practice Tests</CardTitle>
                <CardDescription>Full-length mock exams</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">JEE Main Mock #15</span>
                <Badge className="bg-success text-white">New</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>3 hours</span>
              </div>
              <Button 
                className="w-full bg-success glow-success text-white hover:bg-success/90"
                onClick={handleStartTest}
              >
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Study Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="gradient-card border-border/50 hover:glow-primary transition-all duration-300">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quick Fire</h3>
            <p className="text-sm text-muted-foreground mb-4">10 rapid questions</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleQuickFire}
            >
              Start
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 hover:glow-secondary transition-all duration-300">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Memory Palace</h3>
            <p className="text-sm text-muted-foreground mb-4">Memorization drills</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleMemoryPalace}
            >
              Practice
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 hover:glow-success transition-all duration-300">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Review</h3>
            <p className="text-sm text-muted-foreground mb-4">Previous mistakes</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleReview}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Study Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">42</p>
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">89%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">7</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Study;