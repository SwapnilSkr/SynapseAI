import mongoose from "mongoose";
import { mongoString } from "../types/mongooseTypes";

const OrganizationSchema = new mongoose.Schema(
  {
    baseEmail: {
      type: mongoString,
      required: true,
      unique: true,
    },
    domain: {
      type: mongoString,
      required: true,
      unique: true,
    },
    companyName: {
      type: mongoString,
      required: false,
    },
    lastName: {
      type: mongoString,
      required: false,
    },
    password: {
      type: mongoString,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("Organization", OrganizationSchema);
