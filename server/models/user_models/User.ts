import mongoose from "mongoose";

type User = {
  account?: string;
  email?: string;
  password: string;
  name?: string;
  age?: number;
};

const UserSchema = new mongoose.Schema<User>({
  account: {
    type: String,
    required: function () {
      return !this.email;
    },
  },
  email: {
    type: String,
    required: function () {
      return !this.account;
    },
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
});

const User = mongoose.model<User>("User", UserSchema);

export default User;
