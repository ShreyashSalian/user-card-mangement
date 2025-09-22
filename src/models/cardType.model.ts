import mongoose, { Types, Document, Schema } from "mongoose";

interface CartTypeDocument extends Document {
  _id: string;
  name: string;
  cardType: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum CARD_TYPE_ENUM {
  VIRTUAL = "Virtual",
  PHYSICAL = "Physical",
}

const cardTypeSchema = new Schema<CartTypeDocument>(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Debit", "Credit",
    cardType: {
      type: String,
      enum: Object.values(CARD_TYPE_ENUM),
    },
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
