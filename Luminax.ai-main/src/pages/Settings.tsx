import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Shield, 
  Zap, 
  Monitor,
  Mail,
  Phone
} from "lucide-react";

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-primary bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Customize your Luminax AI experience
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" placeholder="Your Name" defaultValue="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="community">Primary Community</Label>
              <Select defaultValue="jee">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class8">Class 8 Warriors</SelectItem>
                  <SelectItem value="class10">Class 10 Champions</SelectItem>
                  <SelectItem value="jee">JEE Legends</SelectItem>
                  <SelectItem value="upsc">UPSC Titans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full gradient-primary glow-primary">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">Study session reminders</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Achievement Alerts</Label>
                <p className="text-sm text-muted-foreground">Badge and XP notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Community Updates</Label>
                <p className="text-sm text-muted-foreground">New posts and discussions</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Leaderboard Updates</Label>
                <p className="text-sm text-muted-foreground">Rank changes and challenges</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Notification Time</Label>
              <Select defaultValue="evening">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (2:00 PM)</SelectItem>
                  <SelectItem value="evening">Evening (7:00 PM)</SelectItem>
                  <SelectItem value="night">Night (9:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Study Preferences */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Study Preferences
            </CardTitle>
            <CardDescription>Customize your learning experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Quiz Difficulty</Label>
              <Select defaultValue="adaptive">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="adaptive">Adaptive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily XP Goal</Label>
              <Select defaultValue="200">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 XP (Casual)</SelectItem>
                  <SelectItem value="200">200 XP (Regular)</SelectItem>
                  <SelectItem value="300">300 XP (Dedicated)</SelectItem>
                  <SelectItem value="500">500 XP (Hardcore)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-save Progress</Label>
                <p className="text-sm text-muted-foreground">Save quiz progress automatically</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Hints</Label>
                <p className="text-sm text-muted-foreground">Display helpful hints during quizzes</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Streak Protection</Label>
                <p className="text-sm text-muted-foreground">Protect streak when you miss a day</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account & Privacy Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account & Privacy
            </CardTitle>
            <CardDescription>Manage your account security and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Show your profile to other users</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Activity Status</Label>
                <p className="text-sm text-muted-foreground">Show when you're online</p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              App Preferences
            </CardTitle>
            <CardDescription>Customize the app interface and behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for achievements</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Animations</Label>
                <p className="text-sm text-muted-foreground">Enable UI animations</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize motion for accessibility</p>
              </div>
              <Switch />
            </div>

            <Separator />

            <Button variant="outline" className="w-full">
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;