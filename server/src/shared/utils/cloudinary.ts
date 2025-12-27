import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env";

dotenv.config({ path: ".env" });

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export const uploadSingleImage = async (image: string, folder_name: string) => {
  const response = await cloudinary.uploader.upload(image, {
    folder: folder_name,
  });

  return {
    image_url: response.secure_url,
    public_alt: response.public_id,
  };
};

export const deleteImage = async (public_alt: string) => {
  const response = await cloudinary.uploader.destroy(public_alt);

  return response?.result === "ok";
};
