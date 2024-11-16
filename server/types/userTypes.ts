import { mongoIdType, mongoStringType } from "./mongooseTypes";

export type userType = {
  _id?: mongoIdType;
  email?: mongoStringType;
  displayName?: mongoStringType;
  password?: mongoStringType;
};

export interface CustomUser extends Express.User {
  _id: string;
  googleId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  verified?: boolean;
  resentEmail?: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
