import mongoose, { Schema, model } from "mongoose";

interface ISnippet {
  userId?: mongoose.Types.ObjectId;
  clerkId: string;
  brandName: string;
  brandLogo: string;
  welcome: string;
  buttonMsg: string;
  elementPosition: string;
  status: string;
  snippetId: string;
}

const SnippetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    clerkId: String,
    brandName: String,
    brandLogo: String,
    welcome: String,
    buttonMsg: String,
    elementPosition: String,
    status: String,
    snippetId: String,
  },
  { timestamps: true },
);

const Snippet = model<ISnippet>("Snippet", SnippetSchema);

export default Snippet;
