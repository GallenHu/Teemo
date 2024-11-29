import mongoose, { ObjectId } from "mongoose";

export interface Categories extends mongoose.Document {
  name: string;
  order: number;
  user: ObjectId;
}

const CategorySchema = new mongoose.Schema<Categories>({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name."],
    maxlength: [20, "Name cannot be more than 20 characters"],
  },
  order: {
    type: Number,
    default: 999,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Category ||
  mongoose.model<Categories>("Category", CategorySchema);
