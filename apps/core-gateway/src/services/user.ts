import bcrypt from "bcryptjs";
import crypto from "crypto";

export type Role = "student" | "organizer" | "sponsor";

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  passwordHash: string;
}

const usersByEmail = new Map<string, StoredUser>();

export function createUser(input: { email: string; fullName: string; role: Role; passwordHash: string }): StoredUser {
  const id = crypto.randomUUID();
  const user: StoredUser = { id, ...input };
  usersByEmail.set(user.email, user);
  return user;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return usersByEmail.get(email);
}

export function validatePassword(user: StoredUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export function toPublicUser(user: StoredUser) {
  return {
    id: user.id,
    email: user.email,
    username: user.email.split("@")[0],
    role: user.role,
    fullName: user.fullName,
  };
}

