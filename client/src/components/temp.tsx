type ImageValue = {
  file?: File;
  url: string;
};

interface ImageUploadProps {
  image: ImageValue | null;
  onChange: (value: ImageValue | null) => void;
}

export default function ImageUpload({
  image,
  onChange,
}: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    onChange({
      file,
      url: previewUrl,
    });
  };

  const removeImage = () => {
    onChange(null);
  };

  return (
    <div className="border rounded-md p-2 flex flex-col gap-2">
      {image ? (
        <>
          <img
            src={image.url}
            alt="Preview"
            className="h-32 w-full object-cover rounded"
          />
          <button
            type="button"
            onClick={removeImage}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        </>
      ) : (
        <input type="file" accept="image/*" onChange={handleFileChange} />
      )}
    </div>
  );
}
