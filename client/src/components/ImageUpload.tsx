import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

/* ---------- TYPE (MATCHES ZOD) ---------- */
export type ImageValue = {
  file?: File;
  url: string;
  public_alt?: string;
};

interface ImageUploadProps {
  image: ImageValue | null;
  onChange: (value: ImageValue | null) => void;
}

/* ---------- COMPONENT ---------- */
const ImageUpload: React.FC<ImageUploadProps> = ({ image, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  /* ---------- PREVIEW HANDLING ---------- */
  useEffect(() => {
    if (image?.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image.file);
    } else if (image?.url) {
      setPreview(image.url);
    } else {
      setPreview(null);
    }
  }, [image]);

  /* ---------- FILE CHANGE ---------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    onChange({
      file,
      url: previewUrl,
    });
  };

  /* ---------- REMOVE ---------- */
  const removeImage = () => {
    onChange(null);
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
            <Trash className="text-destructive" />
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
