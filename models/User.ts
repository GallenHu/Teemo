import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  name: string;
  email: string;
  emailVerified: string;
  image: string;
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<Users>({
  name: {
    /* The name of this pet */

    type: String,
    required: [true, "Please provide a name for this user."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email for this user."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  emailVerified: {
    /* emailVerified date */

    type: String,
  },
  image: {
    /* Url to image */
    type: String,
  },
});

export default mongoose.models.User ||
  mongoose.model<Users>("User", UserSchema);
