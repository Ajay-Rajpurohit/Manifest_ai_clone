import mongoose, { Schema, model } from "mongoose";

interface IProducts {
  userId?: mongoose.Types.ObjectId;
  clerkId: string;
  productId?: string,
  productTitle?: string,
  productDescription?: string,
  productCreated?: string,
  status?: string,
  productHandle?: string,
  price?: string,
  imageSrc?: string,
  keywords?: Array<string>
}

const ProductsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    clerkId: String,
    productId: String,
    productTitle: String,
    productDescription: String,
    productCreated: String,
    status: String,
    productHandle: String,
    price: String,
    imageSrc: String,
    keywords: [String]
  },
  { timestamps: true },
);

const Products = model<IProducts>("Products", ProductsSchema);

export default Products;
