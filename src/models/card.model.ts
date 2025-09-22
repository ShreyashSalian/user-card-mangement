import mongoose, { Types, Document, Schema } from "mongoose";

export interface CardDocument extends Document {
  _id: string;
  userId: Types.ObjectId;
  cardTypeId: Types.ObjectId;
  cardProviderId: Types.ObjectId;
  cardNumber: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<CardDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardType",
      required: true,
    },
    cardProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardProvider",
      required: true,
    },
    cardNumber: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.model<CardDocument>("Card", cardSchema);
