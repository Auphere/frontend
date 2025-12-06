import { useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarChange: (file: File) => void;
}

export const AvatarUpload = ({ currentAvatar, userName, onAvatarChange }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      onAvatarChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
          {preview ? (
            <img src={preview} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full shadow-md"
          onClick={handleClick}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Click the camera icon to change your photo
        </p>
      </div>
    </div>
  );
};
