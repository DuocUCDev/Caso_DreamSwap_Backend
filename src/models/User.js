import mongoose from "mongoose";
import { lowercase, minLength } from "zod";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, trim: true, required: true, minLength: 6 },
        lastName: { type: String, trim: true, required: true, minLength: 6 },
        email: { type: String, trim: true, lowercase: true, required: true, unique: true },
        phone: { type: String, trim: true, unique: true, sparse: true },
        passwordHash: { type: String, required: true, select: false },
        isActive: { type: Boolean, default: true },
        isAdmin: { type: Boolean, default: false },
        profileImage: { type: String, trim: true }
    },
    { timestamps: true }
);

// Indices útiles
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);