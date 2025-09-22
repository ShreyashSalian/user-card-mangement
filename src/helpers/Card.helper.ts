import mongoose, { Types } from "mongoose";
export interface CardBody {
  userId: Types.ObjectId;
  cardTypeId: Types.ObjectId;
  cardProviderId: Types.ObjectId;
  cardNumber: string;
}
