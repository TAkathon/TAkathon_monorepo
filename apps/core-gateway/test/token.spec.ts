/**
 * token.spec.ts
 * Unit tests for apps/core-gateway/src/services/token.ts
 *
 * Verifies:
 *  1. signAccessToken / signRefreshToken produce valid JWTs
 *  2. verifyAccessToken / verifyRefreshToken decode correct payloads
 *  3. Wrong secret is rejected (returns null)
 *  4. Expired token is rejected (returns null)
 *  5. Invalid role strings are rejected
 *  6. Cross-use of access vs refresh secret is rejected
 */

import assert from "assert";
import jwt from "jsonwebtoken";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../src/services/token";
import { UserRole } from "@takathon/shared/types";

// ─── helpers ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗  ${name}`);
    console.error(`       ${err?.message ?? err}`);
    failed++;
  }
}

const mockUser = {
  id: "test-uuid-1234",
  email: "alice@test.com",
  fullName: "Alice Test",
  role: UserRole.STUDENT,
  passwordHash: "irrelevant",
};

// ─── tests ──────────────────────────────────────────────────────────────────

console.log("\n=== Token Service ===");

test("signAccessToken returns a non-empty string", () => {
  const tok = signAccessToken(mockUser);
  assert.strictEqual(typeof tok, "string");
  assert.ok(tok.length > 32);
});

test("verifyAccessToken decodes correct payload", () => {
  const tok = signAccessToken(mockUser);
  const payload = verifyAccessToken(tok);
  assert.ok(payload, "payload should not be null");
  assert.strictEqual(payload!.id, mockUser.id);
  assert.strictEqual(payload!.email, mockUser.email);
  assert.strictEqual(payload!.role, UserRole.STUDENT);
});

test("signRefreshToken returns a non-empty string", () => {
  const tok = signRefreshToken(mockUser);
  assert.strictEqual(typeof tok, "string");
  assert.ok(tok.length > 32);
});

test("verifyRefreshToken decodes correct payload", () => {
  const tok = signRefreshToken(mockUser);
  const payload = verifyRefreshToken(tok);
  assert.ok(payload, "payload should not be null");
  assert.strictEqual(payload!.id, mockUser.id);
  assert.strictEqual(payload!.email, mockUser.email);
  assert.strictEqual(payload!.role, UserRole.STUDENT);
});

test("verifyAccessToken with wrong secret returns null", () => {
  const badToken = jwt.sign(
    { id: "x", email: "x@x.com", role: "student" },
    "totally-wrong-secret",
    { expiresIn: "1h" }
  );
  assert.strictEqual(verifyAccessToken(badToken), null);
});

test("verifyRefreshToken with wrong secret returns null", () => {
  const badToken = jwt.sign(
    { id: "x", email: "x@x.com", role: "student" },
    "totally-wrong-secret",
    { expiresIn: "7d" }
  );
  assert.strictEqual(verifyRefreshToken(badToken), null);
});

test("verifyAccessToken with expired token returns null", () => {
  const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_in_prod_min32chars";
  const expiredToken = jwt.sign(
    { id: "y", email: "y@y.com", role: "student" },
    secret,
    { expiresIn: -1 } // already expired
  );
  assert.strictEqual(verifyAccessToken(expiredToken), null);
});

test("verifyRefreshToken with expired token returns null", () => {
  const secret = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_in_prod_min32chars";
  const expiredToken = jwt.sign(
    { id: "y", email: "y@y.com", role: "student" },
    secret,
    { expiresIn: -1 }
  );
  assert.strictEqual(verifyRefreshToken(expiredToken), null);
});

test("verifyAccessToken rejects invalid role value", () => {
  const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_in_prod_min32chars";
  const badRoleToken = jwt.sign(
    { id: "z", email: "z@z.com", role: "admin" }, // 'admin' is not a valid role
    secret,
    { expiresIn: "1h" }
  );
  assert.strictEqual(verifyAccessToken(badRoleToken), null);
});

test("access token cannot be verified with refresh verifier", () => {
  // Cross-secret usage must fail
  const accessTok = signAccessToken(mockUser);
  assert.strictEqual(verifyRefreshToken(accessTok), null);
});

test("refresh token cannot be verified with access verifier", () => {
  const refreshTok = signRefreshToken(mockUser);
  assert.strictEqual(verifyAccessToken(refreshTok), null);
});

test("organizer token carries correct role", () => {
  const orgUser = { ...mockUser, role: UserRole.ORGANIZER };
  const tok = signAccessToken(orgUser);
  const payload = verifyAccessToken(tok);
  assert.strictEqual(payload!.role, UserRole.ORGANIZER);
});

test("sponsor token carries correct role", () => {
  const sponsorUser = { ...mockUser, role: UserRole.SPONSOR };
  const tok = signAccessToken(sponsorUser);
  const payload = verifyAccessToken(tok);
  assert.strictEqual(payload!.role, UserRole.SPONSOR);
});

// ─── summary ────────────────────────────────────────────────────────────────

console.log(`\n  ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
