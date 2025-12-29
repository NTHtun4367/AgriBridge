import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

interface ProfileUploadDialogProps {
  status: "farmer" | "merchant";
}

const ProfileUploadDialog = ({ status }: ProfileUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-open logic: Trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please choose an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDialogBox = (skip: boolean) => {
    if (!skip) {
      // Logic to send imagePreview to your backend
      console.log("Saving image...");
    }
    setIsOpen(false);

    if (status === "farmer") {
      navigate("/login");
    } else if (status === "merchant") {
      navigate("/verification-submitted");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Add a profile photo to recognize you.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-secondary transition-all group-hover:opacity-80">
              <AvatarImage src={imagePreview || ""} />
              <AvatarFallback className="bg-muted">
                <Camera className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full shadow-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          {imagePreview && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove photo
            </Button>
          )}
        </div>

        {/* <DialogFooter className="flex flex-col sm:flex-row gap-2"> */}
        <DialogFooter className="flex justify-between gap-4">
          <Button
            variant="outline"
            className="flex-1"
            // onClick={() => setIsOpen(false)}
            onClick={() => handleDialogBox(true)}
          >
            Skip for now
          </Button>
          <Button
            disabled={!imagePreview}
            className="flex-1"
            // onClick={handleSave}
            onClick={() => handleDialogBox(false)}
          >
            Save and continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUploadDialog;
