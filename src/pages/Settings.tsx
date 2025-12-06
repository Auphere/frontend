import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { SecurityTab } from '@/components/settings/SecurityTab';
import { User, Settings as SettingsIcon, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Account Settings
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Manage your profile, preferences, and security settings
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2 py-3">
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 py-3">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
