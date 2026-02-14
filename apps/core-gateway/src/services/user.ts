import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@takathon/shared/types";

// Keep StoredUser interface for compatibility or refactor to use Prisma's User type
export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash: string;
}

export class UserService {
  static async createUser(input: {
    email: string;
    fullName: string;
    role: UserRole;
    passwordHash: string;
  }): Promise<StoredUser> {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        role: input.role as any, // Cast to match Prisma enum if needed
        passwordHash: input.passwordHash,
        username:
          input.email.split("@")[0] + "_" + Math.floor(Math.random() * 10000), // Generate unique username
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as unknown as UserRole,
      passwordHash: user.passwordHash,
    };
  }

  static async findByEmail(email: string): Promise<StoredUser | undefined> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return undefined;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as unknown as UserRole,
      passwordHash: user.passwordHash,
    };
  }

  static async validatePassword(
    user: StoredUser,
    password: string,
  ): Promise<boolean> {
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
