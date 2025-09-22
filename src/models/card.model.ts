import mongoose, { Types, Document, Schema } from "mongoose";

export interface CardDocument extends Document {
  _id: string;
  userId: Types.ObjectId;
  cardTypeId: Types.ObjectId;
  cardProviderId: Types.ObjectId;
  cardNumber: string;
  isDeleted: boolean;
  createdAt: Date;
  cardStatus: string;
  updatedAt: Date;
}

enum CARD_STATUS {
  INPROGESS = "inprogress",
  COMPELTED = "completed",
  PENDING = "pending",
  MISSSED = "missed",
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
    cardStatus: {
      type: String,
      enum: Object.values(CARD_STATUS),
      default: CARD_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.model<CardDocument>("Card", cardSchema);
