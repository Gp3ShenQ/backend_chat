import mongoose from "mongoose";

const deleteUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const deleteUser = mongoose.model("deleteUser", deleteUserSchema);

export default deleteUser;
