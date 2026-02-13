import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRole } from "@takathon/shared/types";

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash: string;
}

// In-memory user store (to be replaced with DB)
const usersByEmail = new Map<string, StoredUser>();

export class UserService {
  static async createUser(input: { 
    email: string; 
    fullName: string; 
    role: UserRole; 
    passwordHash: string 
  }): Promise<StoredUser> {
    const id = crypto.randomUUID();
    const user: StoredUser = { id, ...input };
    usersByEmail.set(user.email, user);
    return user;
  }

  static async findByEmail(email: string): Promise<StoredUser | undefined> {
    return usersByEmail.get(email);
  }

  static async validatePassword(user: StoredUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  static toPublicUser(user: StoredUser) {
    return {
      id: user.id,
      email: user.email,
      username: user.email.split("@")[0],
      role: user.role,
      fullName: user.fullName,
    };
  }
}

