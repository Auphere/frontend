import { useTranslation } from "react-i18next";
import { Globe, User, Bell, Shield, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { STORAGE_KEYS } from "@/lib/constants";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    toast.success(t("settings.languageChanged"));
  };

  const currentLanguage = i18n.language || "es";

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 border-b">
        <div className="px-4 md:px-6 py-4">
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* User Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {t("settings.preferences")}
          </h2>

          {/* Language Selector */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{t("settings.language")}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("settings.selectLanguage")}
                </p>

                <Select
                  value={currentLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇸</span>
                        <span>{t("settings.spanish")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span>
                        <span>{t("settings.english")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">
                    {t("settings.notifications")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage notification preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{t("settings.privacy")}</h3>
                  <p className="text-sm text-muted-foreground">
                    Privacy and data settings
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t("settings.about")}</h2>

          <Card className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
              <span className="text-sm font-medium">
                {t("settings.termsOfService")}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
              <span className="text-sm font-medium">
                {t("settings.privacyPolicy")}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
              <span className="text-sm font-medium">{t("settings.help")}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
              <span className="text-sm font-medium">
                {t("settings.feedback")}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {t("auth.logout")}
          </Button>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          {t("settings.version")} 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
