import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Copy, Mail, Share2, UserPlus } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  email: string;
}

interface SharePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planId: string;
}

export const SharePlanDialog = ({ open, onOpenChange, planName, planId }: SharePlanDialogProps) => {
  const [email, setEmail] = useState("");
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/plan/${planId}`;

  const handleInviteFriend = () => {
    if (!email) return;
    
    // TODO: SUPABASE INTEGRATION REQUIRED
    // Send invitation through Supabase Edge Function
    // await supabase.functions.invoke('send-plan-invitation', {
    //   body: { email, planId, planName }
    // });

    const newFriend: Friend = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
    };

    setInvitedFriends([...invitedFriends, newFriend]);
    setEmail("");
    
    toast({
      title: "Invitation sent!",
      description: `We've invited ${newFriend.email} to join your plan.`,
    });
  };

  const handleRemoveFriend = (friendId: string) => {
    setInvitedFriends(invitedFriends.filter(f => f.id !== friendId));
    toast({
      title: "Friend removed",
      description: "They won't receive updates about this plan anymore.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share this link with your friends.",
    });
  };

  const handleShareByEmail = () => {
    const subject = encodeURIComponent(`Join me for: ${planName}`);
    const body = encodeURIComponent(
      `I'm planning an evening and would love for you to join!\n\nPlan: ${planName}\n\nClick here to view: ${shareUrl}\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share "{planName}"
          </DialogTitle>
          <DialogDescription>
            Invite friends to join your plan and make it a memorable evening together!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Invite by email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite friend by email
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="friend@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInviteFriend()}
              />
              <Button onClick={handleInviteFriend} size="sm">
                Invite
              </Button>
            </div>
          </div>

          {/* Invited friends list */}
          {invitedFriends.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                People joining ({invitedFriends.length})
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {invitedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{friend.name}</div>
                      <div className="text-xs text-muted-foreground">{friend.email}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share link */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Or share link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-xs"
              />
              <Button onClick={handleCopyLink} size="sm" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick share actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleShareByEmail}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            {navigator.share && (
              <Button
                onClick={() => {
                  navigator.share({
                    title: planName,
                    text: `Join me for: ${planName}`,
                    url: shareUrl,
                  });
                }}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                More
              </Button>
            )}
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Networking tip:</strong> Sharing plans helps you discover new people and places together. Your friends can see the itinerary and join you!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
