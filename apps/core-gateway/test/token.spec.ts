import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from "../src/services/token";
import { StoredUser } from "../src/services/user";

const user: StoredUser = {
  id: "u1",
  email: "test@example.com",
  fullName: "Test User",
  role: "student",
  passwordHash: "hash",
};

const access = signAccessToken(user);
const refresh = signRefreshToken(user);

const accessPayload = verifyAccessToken(access);
const refreshPayload = verifyRefreshToken(refresh);

if (!accessPayload || accessPayload.email !== user.email) {
  throw new Error("access token verification failed");
}
if (!refreshPayload || refreshPayload.email !== user.email) {
  throw new Error("refresh token verification failed");
}

