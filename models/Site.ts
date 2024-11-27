import mongoose, { ObjectId } from "mongoose";

export interface Sites extends mongoose.Document {
  name: string;
  url: string;
  icon: string;
  category: ObjectId;
  user: ObjectId;
}

const SiteSchema = new mongoose.Schema<Sites>({
  name: {
    type: String,
    required: [true, "Please provide a name."],
    maxlength: [20, "Name cannot be more than 20 characters"],
  },
  url: {
    type: String,
    required: [true, "Please provide a url."],
  },
  icon: {
    type: String,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: [true, "Cart must belong to a category"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Cart must belong to a user"],
  },
});

export default mongoose.models.Site ||
  mongoose.model<Sites>("Site", SiteSchema);
