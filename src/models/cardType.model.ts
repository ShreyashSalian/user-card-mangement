import mongoose, { Types, Document, Schema } from "mongoose";

interface CartTypeDocument extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const cardTypeSchema = new Schema<CartTypeDocument>(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Debit", "Credit"
  },
  { timestamps: true }
);

export default mongoose.model<CartTypeDocument>("CardType", cardTypeSchema);
