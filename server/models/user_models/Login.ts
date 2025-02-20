import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
  account: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});

const Login = mongoose.model("Login", LoginSchema);

export default Login;
