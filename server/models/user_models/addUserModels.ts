import mongoose from "mongoose";

const addUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});

const addUserModels = mongoose.model("addUser", addUserSchema);

export default addUserModels;
