import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const organizationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        name: {
            type: String,
            required: true,
            unique: false, //--> Make it true to add constrained uniqueness on org name
        },
        users: [
            {
                type: String,
                ref: "User",
            }
        ],
        admin: [
            {
                type: String,
                ref: "User",
            }
        ],
        inviteCode: {
            code: String,
            expiresAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
