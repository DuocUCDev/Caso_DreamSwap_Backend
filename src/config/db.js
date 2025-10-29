import mongoose from "mongoose";

export async function connectDB(uri) {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}