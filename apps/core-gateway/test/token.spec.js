"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../src/services/token");
const user = {
    id: "u1",
    email: "test@example.com",
    fullName: "Test User",
    role: "student",
    passwordHash: "hash",
};
const access = (0, token_1.signAccessToken)(user);
const refresh = (0, token_1.signRefreshToken)(user);
const accessPayload = (0, token_1.verifyAccessToken)(access);
const refreshPayload = (0, token_1.verifyRefreshToken)(refresh);
if (!accessPayload || accessPayload.email !== user.email) {
    throw new Error("access token verification failed");
}
if (!refreshPayload || refreshPayload.email !== user.email) {
    throw new Error("refresh token verification failed");
}
