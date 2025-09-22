import mongoose, { Types, Document, Schema } from "mongoose";

interface CartTypeDocument extends Document {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cardTypeSchema = new Schema<CartTypeDocument>(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Debit", "Credit",
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const CardType = mongoose.model<CartTypeDocument>(
  "CardType",
  cardTypeSchema
);
