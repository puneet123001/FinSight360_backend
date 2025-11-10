import { auth } from "google-auth-library";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  authProvider: String,
});

export default User = mongoose.model("User", userSchema);
