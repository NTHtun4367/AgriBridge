import { uploadSingleImage } from "../../../shared/utils/cloudinary";
import { Entry } from "../models/entry";

export class EntryService {
  async createEntry(userId: string, body: any, file?: Express.Multer.File) {
    // FIX: Destructure 'season' from the body
    const { date, type, category, season, quantity, unit, value, notes } = body;

    let uploadedBill = undefined;

    if (file) {
      uploadedBill = await uploadSingleImage(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        "/agribridge/bills",
      );
    }

    const entryData = {
      userId,
      date: new Date(date),
      type,
      category,
      season, // FIX: Include season here so it saves to MongoDB
      quantity: quantity ? Number(quantity) : undefined,
      unit,
      value: Number(value),
      notes,
      billImageUrl: uploadedBill ? uploadedBill.image_url : undefined,
    };

    const newEntry = await Entry.create(entryData);
    return newEntry;
  }

  async getAllEntries(userId: string) {
    // Sort by date descending to show newest activity first
    return await Entry.find({ userId }).sort({ date: -1 });
  }

  async getEntryById(id: string, userId: string) {
    const entry = await Entry.findOne({ _id: id, userId });
    if (!entry) throw new Error("Entry not found.");
    return entry;
  }
}

export const entryService = new EntryService();
