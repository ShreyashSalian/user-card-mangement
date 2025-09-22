import mongoose, { Types, Document, Schema } from "mongoose";

interface CardProviderDocument extends Document {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cardProviderSchema = new Schema<CardProviderDocument>(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Visa", "MasterCard"
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model<CardProviderDocument>(
  "CardProvider",
  cardProviderSchema
);

export const CardProvider = mongoose.model<CardProviderDocument>(
  "CardProvider",
  cardProviderSchema
);
