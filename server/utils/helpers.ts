import bcrypt from "bcrypt";
import fs from "fs";
import { userType } from "../types/userTypes";
import { User } from "../models/user.model";
import { Request } from "express";
import { promisify } from "util";

export const unlinkAsync = promisify(fs.unlink);

const saltRounds = 10;

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string) =>
  bcrypt.compareSync(plain, hashed);

export const serializeUser = (
  user: userType,
  done: (err: any, id?: unknown) => void
) => {
  done(null, user._id);
};

export const deserializeUser = async (
  id: unknown,
  done: (err: any, id?: unknown) => void
) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
};

export const cleanupFiles = async (
  filepathsArray?: string[],
  agentPic?: any
) => {
  try {
    if (filepathsArray) {
      await Promise.all(
        filepathsArray.map(async (filePath) => {
          await unlinkAsync(filePath);
          console.log(`File ${filePath} deleted successfully.`);
        })
      );
    }

    if (agentPic) {
      await unlinkAsync(`${agentPic.destination}${agentPic.filename}`);
    }
  } catch (err) {
    console.error("Error deleting local files:", err);
  }
};

export const removeSpaces = (entity: string) => {
  return entity.replace(/\s+/g, "");
};

export const uniqueAgentName = (agentName: string, email: string) => {
  const emailUsername = email.split("@")[0];
  const emailDomain = email.split("@")[1].split(".")[0];
  const agentNameWithoutSpaces = removeSpaces(agentName);
  return `${agentNameWithoutSpaces}_${emailUsername}_${emailDomain}`;
};

export interface CustomRequest extends Request {
  user?: userType;
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}

export interface PassportRequest extends Request {
  authMethod?: string;
  passportInternalErr?: Error | null;
  passportauthErr?: any;
}

export const combineDocs = (docs: any) => {
  return docs.map((doc: any) => doc.pageContent).join("\n\n");
};
