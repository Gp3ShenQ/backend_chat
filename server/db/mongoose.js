import mongoose from "mongoose";

const connectDB = async () => {
  const db = mongoose.connection;
  try {
    await mongoose.connect(
      `mongodb+srv://gp3g4xup6:iInDtARKq7WVSOrw@cluster0.udzso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
