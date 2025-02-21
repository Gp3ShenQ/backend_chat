import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
  account: {
    type: String,
    required: function () {
      return !this.email;
    },
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: function () {
      return !this.account;
    },
  },
});

const Login = mongoose.model("Login", LoginSchema);

export default Login;
