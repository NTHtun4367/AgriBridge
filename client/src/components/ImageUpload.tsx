import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageUploadProps {
  images: File[] | null;
  onChange: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      const file = images[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    onChange([file]); // always pass array for compatibility
  };

  const removeImage = () => {
    onChange([]);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-24 object-cover rounded border"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1"
            onClick={removeImage}
          >
            <Trash className="font-bold text-destructive" />
          </Button>
        </div>
      ) : (
        <label className="cursor-pointer w-40 h-24 flex items-center justify-center border-2 border-dashed rounded">
          <span className="text-sm text-muted-foreground">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
