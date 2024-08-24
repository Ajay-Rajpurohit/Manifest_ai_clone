import mongoose, { Schema, model } from "mongoose";

interface IShopifyIntegration {
  userId?: mongoose.Types.ObjectId;
  clerkId: string;
  shopifyURL: string;
  accessToken: string;
  status: string;
  email?: string;
}

const ShopifyIntegrationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    clerkId: String,
    shopifyURL: String,
    accessToken: String,
    status: String,
    email: String
  },
  { timestamps: true },
);

const ShopifyIntegration = model<IShopifyIntegration>("ShopifyIntegration", ShopifyIntegrationSchema);

export default ShopifyIntegration;
