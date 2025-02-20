import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
