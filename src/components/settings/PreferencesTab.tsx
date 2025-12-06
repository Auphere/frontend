import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const PreferencesTab = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    language: user?.language || 'es',
    notifications: user?.preferences?.notifications ?? true,
    newsletter: user?.preferences?.newsletter ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        language: preferences.language as 'es' | 'en',
        preferences: {
          notifications: preferences.notifications,
          newsletter: preferences.newsletter,
        },
      });

      toast({
        title: 'Preferences updated',
        description: 'Your preferences have been successfully saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your app preferences and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value: 'es' | 'en') => setPreferences({ ...preferences, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive updates about your plans and places
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, notifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter">Newsletter</Label>
                <p className="text-xs text-muted-foreground">
                  Get tips and discover new places weekly
                </p>
              </div>
              <Switch
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, newsletter: checked })
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
