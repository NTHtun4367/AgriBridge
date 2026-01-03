import { uploadSingleImage } from "../../../shared/utils/cloudinary";
import { Entry } from "../models/entry";

export class EntryService {
  async createEntry(userId: string, body: any, file?: Express.Multer.File) {
    const { date, type, category, quantity, unit, value, notes } = body;

    let uploadedBill = undefined;

    if (file) {
      uploadedBill = await uploadSingleImage(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        "/agribridge/bills"
      );
    }

    const entryData = {
      userId,
      date: new Date(date),
      type,
      category,
      quantity: quantity ? Number(quantity) : undefined,
      unit,
      value: Number(value),
      notes,
      // store the file path if an image was uploaded
      billImageUrl: uploadedBill ? uploadedBill.image_url : undefined,
    };

    const newEntry = await Entry.create(entryData);
    return newEntry;
  }

  async getAllEntries(userId: string) {
    // Use .find() because one user has many entries.
    // Adding .sort({ date: -1 }) ensures newest items are at the top.
    const entries = await Entry.find({ userId }).sort({ date: -1 });
    return entries;
  }

  async getEntryById(id: string, userId: string) {
    const entry = await Entry.findOne({ _id: id, userId });

    if (!entry) {
      throw new Error("Entry not found.");
    }
    return entry;
  }
}

export const entryService = new EntryService();
