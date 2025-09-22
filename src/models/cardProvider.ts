import mongoose, { Types, Document, Schema } from "mongoose";

interface CardProviderDocument extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const cardProviderSchema = new Schema<CardProviderDocument>(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Visa", "MasterCard"
  },
  { timestamps: true }
);

export default mongoose.model<CardProviderDocument>(
  "CardProvider",
  cardProviderSchema
);
