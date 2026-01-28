import { uploadSingleImage } from "../../../shared/utils/cloudinary";
import { Entry } from "../../entry/models/entry";

export class EntryService {
  async createEntry(userId: string, body: any, file?: Express.Multer.File) {
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
      season: season || undefined,
      quantity: quantity ? Number(quantity) : undefined,
      unit,
      value: Number(value),
      notes,
      billImageUrl: uploadedBill ? uploadedBill.image_url : undefined,
    };

    return await Entry.create(entryData);
  }

  // --- NEW: Update Entry Logic ---
  async updateEntry(
    id: string,
    userId: string,
    body: any,
    file?: Express.Multer.File,
  ) {
    const entry = await Entry.findOne({ _id: id, userId });
    if (!entry) throw new Error("Entry not found or unauthorized");

    const { date, type, category, season, quantity, unit, value, notes } = body;
    let billImageUrl = entry.billImageUrl;

    if (file) {
      const uploadedBill = await uploadSingleImage(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        "/agribridge/bills",
      );
      billImageUrl = uploadedBill.image_url;
    }

    const updatedData = {
      date: date ? new Date(date) : entry.date,
      type: type || entry.type,
      category: category || entry.category,
      season: season !== undefined ? season : entry.season,
      quantity: quantity !== undefined ? Number(quantity) : entry.quantity,
      unit: unit || entry.unit,
      value: value !== undefined ? Number(value) : entry.value,
      notes: notes !== undefined ? notes : entry.notes,
      billImageUrl,
    };

    return await Entry.findOneAndUpdate({ _id: id, userId }, updatedData, {
      new: true,
    });
  }

  // --- NEW: Delete Entry Logic ---
  async deleteEntry(id: string, userId: string) {
    const entry = await Entry.findOneAndDelete({ _id: id, userId });
    if (!entry) throw new Error("Entry not found or unauthorized");
    return { message: "Entry deleted successfully" };
  }

  async getAllEntries(userId: string) {
    return await Entry.find({ userId }).sort({ date: -1 });
  }

  async getEntryById(id: string, userId: string) {
    const entry = await Entry.findOne({ _id: id, userId });
    if (!entry) throw new Error("Entry not found.");
    return entry;
  }
}

export const entryService = new EntryService();
