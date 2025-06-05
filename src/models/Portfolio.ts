import mongoose, { Schema, Document, models } from "mongoose";

export interface IPortfolio extends Document {
  userEmail: string;
  name: string;
  role: string;
  skills: string;
  projects: string;
  output: string;
  createdAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userEmail: { type: String, required: true },
    name: String,
    role: String,
    skills: String,
    projects: String,
    output: String,
  },
  { timestamps: true }
);

export const Portfolio =
  models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
