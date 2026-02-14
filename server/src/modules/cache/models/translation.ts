import mongoose, { Schema, Document } from "mongoose";

export interface ITranslation extends Document {
  contentId: string;
  field: string;
  sourceText: string;
  myanmarText: string;
  hash: string;
  createdAt: Date;
}

const TranslationSchema: Schema = new Schema({
  contentId: { type: String, required: true, index: true },
  field: { type: String, required: true },
  sourceText: { type: String, required: true },
  myanmarText: { type: String, required: true },
  hash: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // 30 Days
  },
});

// UNIQUE ERROR လုံးဝမတက်စေရန် ဤ Index သာ အမှန်ဖြစ်သည်
TranslationSchema.index({ contentId: 1, field: 1, hash: 1 }, { unique: true });

export const Translation = mongoose.model<ITranslation>(
  "Translation",
  TranslationSchema,
);
