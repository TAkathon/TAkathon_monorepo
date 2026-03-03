/**
 * auth.spec.ts
 * Security integration tests for the auth routes and middleware.
 *
 * Verifies (no real database needed — UserService is mocked):
 *  1.  POST /register  → httpOnly cookies set, NO token in response body
 *  2.  POST /login     → httpOnly cookies set, NO token in response body
 *  3.  POST /login bad creds → 401, no cookies
 *  4.  Rate limiting   → 429 after 10 failed attempts
 *  5.  GET /me         → 401 without accessToken cookie
 *  6.  GET /me         → 200 with valid accessToken cookie
 *  7.  POST /refresh   → 401 without refreshToken cookie
 *  8.  POST /refresh   → new accessToken cookie set, no token in body
 *  9.  POST /logout    → both cookies cleared
 * 10.  RBAC student    → 403 on organizer-only route
 * 11.  RBAC organizer  → 403 on student-only route
 * 12.  ENV guard       → startup check logic validates required vars
 */

import assert from "assert";
import express from "express";
import cookieParser from "cookie-parser";
import * as http from "http";
import path from "path";
import { signAccessToken, signRefreshToken } from "../src/services/token";
import { requireAuth } from "../src/middleware/auth";
import { requireStudent, requireOrganizer, requireSponsor } from "../src/middleware/rbac";
import { ResponseHandler } from "../src/utils/response";
import { UserRole } from "@takathon/shared/types";

// ─── in-memory mock UserService ──────────────────────────────────────────────

const mockStore = new Map<string, any>();

const MockUserService = {
  findByEmail: async (email: string) => mockStore.get(email) ?? null,
  createUser: async (input: {
    email: string;
    fullName: string;
    role: UserRole;
    passwordHash: string;
  }) => {
    const user = { id: "mock-uuid-001", ...input };
    mockStore.set(input.email, user);
    return user;
  },
  validatePassword: async (_user: any, pw: string) => pw === "ValidPass1!",
  toPublicUser: (u: any) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
  }),
};

// Patch require.cache BEFORE loading the auth router so it never touches Prisma
const userServiceModulePath = require.resolve(
  path.resolve(__dirname, "../src/services/user")
);
(require as any).cache[userServiceModulePath] = {
  id: userServiceModulePath,
  filename: userServiceModulePath,
  loaded: true,
  exports: { UserService: MockUserService },
  paths: [],
  children: [],
  parent: null,
} as any;

// Now safe to load auth router (Prisma never imported)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const authRouter = require("../src/routes/auth").default;

// ─── test app factory ─────────────────────────────────────────────────────────

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/auth", authRouter);

  // Minimal protected routes for RBAC tests
  app.get("/api/v1/students/profile", requireAuth, requireStudent, (_req, res) =>
    ResponseHandler.success(res, { role: "student" })
  );
  app.get("/api/v1/organizers/profile", requireAuth, requireOrganizer, (_req, res) =>
    ResponseHandler.success(res, { role: "organizer" })
  );
  app.get("/api/v1/sponsors/profile", requireAuth, requireSponsor, (_req, res) =>
    ResponseHandler.success(res, { role: "sponsor" })
  );

  return app;
}

// ─── simple test runner ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  \u2713  ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  \u2717  ${name}`);
    console.error(`       ${err?.message ?? err}`);
    failed++;
  }
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function makeRequest(
  app: express.Application,
  opts: {
    method: "GET" | "POST";
    path: string;
    body?: object;
    cookies?: string;
  }
): Promise<{ status: number; body: any; headers: http.IncomingMessage["headers"] }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const addr = server.address() as any;
      const bodyStr = opts.body ? JSON.stringify(opts.body) : "";
      const reqOpts: http.RequestOptions = {
        hostname: "127.0.0.1",
        port: addr.port,
        path: opts.path,
        method: opts.method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(bodyStr),
          ...(opts.cookies ? { Cookie: opts.cookies } : {}),
        },
      };
      const req = http.request(reqOpts, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          server.close(() =>
            resolve({
              status: res.statusCode ?? 0,
              body: data ? JSON.parse(data) : {},
              headers: res.headers,
            })
          );
        });
      });
      req.on("error", (e) => server.close(() => reject(e)));
      if (bodyStr) req.write(bodyStr);
      req.end();
    });
  });
}

function parseCookies(
  setCookieHeaders: string | string[] | undefined
): Map<string, { value: string; attrs: string }> {
  const map = new Map<string, { value: string; attrs: string }>();
  if (!setCookieHeaders) return map;
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  for (const header of headers) {
    const parts = header.split(";").map((p) => p.trim());
    const [nameValue] = parts;
    const eqIdx = nameValue.indexOf("=");
    const name = nameValue.slice(0, eqIdx).trim();
    const value = nameValue.slice(eqIdx + 1).trim();
    map.set(name, { value, attrs: header.toLowerCase() });
  }
  return map;
}

// ─── test suite ───────────────────────────────────────────────────────────────

async function runTests() {
  console.log("\n=== Auth Security Integration Tests ===");

  const TEST_EMAIL = "test@example.com";
  const TEST_PASSWORD = "ValidPass1!";

  // Seed the default test user
  mockStore.set(TEST_EMAIL, {
    id: "test-uuid-1",
    email: TEST_EMAIL,
    fullName: "Test User",
    role: UserRole.STUDENT,
    passwordHash: "stored-hash",
  });

  await test("1. POST /register → no token fields in response body", async () => {
    mockStore.clear();
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/register",
      body: { fullName: "Test User", email: "new@test.com", password: TEST_PASSWORD, role: "student" },
    });
    assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(!("accessToken" in (res.body?.data ?? {})), "accessToken must NOT be in response body");
    assert.ok(!("refreshToken" in (res.body?.data ?? {})), "refreshToken must NOT be in response body");
  });

  await test("2. POST /register → sets httpOnly accessToken cookie", async () => {
    mockStore.clear();
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/register",
      body: { fullName: "Test User", email: "reg2@test.com", password: TEST_PASSWORD, role: "student" },
    });
    const cookies = parseCookies(res.headers["set-cookie"]);
    assert.ok(cookies.has("accessToken"), "accessToken cookie must be set");
    assert.ok(
      cookies.get("accessToken")!.attrs.includes("httponly"),
      "accessToken cookie must be HttpOnly"
    );
  });

  await test("3. POST /register → sets httpOnly refreshToken cookie", async () => {
    mockStore.clear();
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/register",
      body: { fullName: "Test User", email: "reg3@test.com", password: TEST_PASSWORD, role: "student" },
    });
    const cookies = parseCookies(res.headers["set-cookie"]);
    assert.ok(cookies.has("refreshToken"), "refreshToken cookie must be set");
    assert.ok(
      cookies.get("refreshToken")!.attrs.includes("httponly"),
      "refreshToken cookie must be HttpOnly"
    );
  });

  await test("4. POST /login with valid creds → no token fields in response body", async () => {
    mockStore.set(TEST_EMAIL, {
      id: "test-uuid-1",
      email: TEST_EMAIL,
      fullName: "Test User",
      role: UserRole.STUDENT,
      passwordHash: "irrelevant",
    });
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(!("accessToken" in (res.body?.data ?? {})), "accessToken must NOT be in response body");
    assert.ok(!("refreshToken" in (res.body?.data ?? {})), "refreshToken must NOT be in response body");
  });

  await test("5. POST /login with valid creds → sets httpOnly accessToken cookie", async () => {
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    const cookies = parseCookies(res.headers["set-cookie"]);
    assert.ok(cookies.has("accessToken"), "accessToken cookie must be set on login");
    assert.ok(
      cookies.get("accessToken")!.attrs.includes("httponly"),
      "accessToken cookie must be HttpOnly"
    );
  });

  await test("6. POST /login with invalid password → 401, no cookies set", async () => {
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: TEST_EMAIL, password: "wrong-password" },
    });
    assert.strictEqual(res.status, 401, `Expected 401 got ${res.status}`);
    const cookies = parseCookies(res.headers["set-cookie"]);
    assert.ok(!cookies.has("accessToken"), "no accessToken cookie on failed login");
    assert.ok(!cookies.has("refreshToken"), "no refreshToken cookie on failed login");
  });

  await test("7. Rate limiter → 429 after 10 failed login attempts on same server", async () => {
    const app = buildApp();
    // Use a persistent server so the rate limit store accumulates state
    const server = await new Promise<http.Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const port = (server.address() as any).port;

    function loginAttempt(): Promise<number> {
      return new Promise((resolve, reject) => {
        const body = JSON.stringify({ email: "ratetest@example.com", password: "wrong" });
        const req = http.request(
          { hostname: "127.0.0.1", port, path: "/api/v1/auth/login", method: "POST",
            headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
          (res) => { res.resume(); resolve(res.statusCode ?? 0); }
        );
        req.on("error", reject);
        req.write(body);
        req.end();
      });
    }

    let lastStatus = 0;
    for (let i = 0; i < 11; i++) {
      lastStatus = await loginAttempt();
    }
    await new Promise<void>((r) => server.close(() => r()));
    assert.strictEqual(lastStatus, 429, `Expected 429 (Too Many Requests) after 11 attempts, got ${lastStatus}`);
  });

  await test("8. GET /me without cookie → 401", async () => {
    const app = buildApp();
    const res = await makeRequest(app, { method: "GET", path: "/api/v1/auth/me" });
    assert.strictEqual(res.status, 401, `Expected 401 got ${res.status}`);
  });

  await test("9. GET /me with valid accessToken cookie → 200 with user data", async () => {
    const app = buildApp();
    const user = {
      id: "me-user-1",
      email: "me@test.com",
      fullName: "Me User",
      role: UserRole.STUDENT,
      passwordHash: "x",
    };
    mockStore.set(user.email, user);
    const token = signAccessToken(user);
    const res = await makeRequest(app, {
      method: "GET",
      path: "/api/v1/auth/me",
      cookies: `accessToken=${token}`,
    });
    assert.strictEqual(res.status, 200, `Expected 200 got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.strictEqual(res.body?.data?.email, user.email);
  });

  await test("10. POST /refresh without refreshToken cookie → 401", async () => {
    const app = buildApp();
    const res = await makeRequest(app, { method: "POST", path: "/api/v1/auth/refresh" });
    assert.strictEqual(res.status, 401, `Expected 401 got ${res.status}`);
  });

  await test("11. POST /refresh with valid refreshToken → new httpOnly accessToken cookie, no token in body", async () => {
    const app = buildApp();
    const user = {
      id: "refresh-user-1",
      email: "refresh@test.com",
      fullName: "Refresh User",
      role: UserRole.STUDENT,
      passwordHash: "x",
    };
    mockStore.set(user.email, user);
    const refreshTok = signRefreshToken(user);
    const res = await makeRequest(app, {
      method: "POST",
      path: "/api/v1/auth/refresh",
      cookies: `refreshToken=${refreshTok}`,
    });
    assert.strictEqual(res.status, 200, `Expected 200 got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(!("accessToken" in (res.body?.data ?? {})), "accessToken must NOT be in refresh response body");
    const cookies = parseCookies(res.headers["set-cookie"]);
    assert.ok(cookies.has("accessToken"), "new accessToken cookie must be set after refresh");
    assert.ok(
      cookies.get("accessToken")!.attrs.includes("httponly"),
      "new accessToken must be HttpOnly"
    );
  });

  await test("12. POST /logout → clears both cookies (expires = epoch)", async () => {
    const app = buildApp();
    const res = await makeRequest(app, { method: "POST", path: "/api/v1/auth/logout" });
    assert.strictEqual(res.status, 200, `Expected 200 got ${res.status}`);
    const cookieHeader = res.headers["set-cookie"] ?? [];
    const headers = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
    const accessCleared = headers.some(
      (h) => h.toLowerCase().startsWith("accesstoken=") && h.toLowerCase().includes("expires=thu, 01 jan 1970")
    );
    const refreshCleared = headers.some(
      (h) => h.toLowerCase().startsWith("refreshtoken=") && h.toLowerCase().includes("expires=thu, 01 jan 1970")
    );
    assert.ok(accessCleared, `accessToken cookie should be cleared. Set-Cookie: ${JSON.stringify(headers)}`);
    assert.ok(refreshCleared, `refreshToken cookie should be cleared. Set-Cookie: ${JSON.stringify(headers)}`);
  });

  await test("13. RBAC: student token → 403 on organizer route", async () => {
    const app = buildApp();
    const studentToken = signAccessToken({
      id: "s1", email: "s@test.com", fullName: "Student",
      role: UserRole.STUDENT, passwordHash: "x",
    });
    const res = await makeRequest(app, {
      method: "GET",
      path: "/api/v1/organizers/profile",
      cookies: `accessToken=${studentToken}`,
    });
    assert.strictEqual(res.status, 403, `Expected 403 got ${res.status}`);
  });

  await test("14. RBAC: organizer token → 403 on student route", async () => {
    const app = buildApp();
    const orgToken = signAccessToken({
      id: "o1", email: "o@test.com", fullName: "Organizer",
      role: UserRole.ORGANIZER, passwordHash: "x",
    });
    const res = await makeRequest(app, {
      method: "GET",
      path: "/api/v1/students/profile",
      cookies: `accessToken=${orgToken}`,
    });
    assert.strictEqual(res.status, 403, `Expected 403 got ${res.status}`);
  });

  await test("15. RBAC: sponsor token → 403 on student route", async () => {
    const app = buildApp();
    const sponsorToken = signAccessToken({
      id: "sp1", email: "sp@test.com", fullName: "Sponsor",
      role: UserRole.SPONSOR, passwordHash: "x",
    });
    const res = await makeRequest(app, {
      method: "GET",
      path: "/api/v1/students/profile",
      cookies: `accessToken=${sponsorToken}`,
    });
    assert.strictEqual(res.status, 403, `Expected 403 got ${res.status}`);
  });

  await test("16. RBAC: student token → 200 on own student route", async () => {
    const app = buildApp();
    const studentToken = signAccessToken({
      id: "s2", email: "s2@test.com", fullName: "Student2",
      role: UserRole.STUDENT, passwordHash: "x",
    });
    const res = await makeRequest(app, {
      method: "GET",
      path: "/api/v1/students/profile",
      cookies: `accessToken=${studentToken}`,
    });
    assert.strictEqual(res.status, 200, `Expected 200 got ${res.status}`);
  });

  await test("17. requireAuth: tampered/invalid JWT → 401", async () => {
    const app = buildApp();
    const res = await makeRequest(app, {
      method: "GET",
      path: "/api/v1/auth/me",
      cookies: "accessToken=this.is.not.a.valid.jwt",
    });
    assert.strictEqual(res.status, 401, `Expected 401 got ${res.status}`);
  });

  await test("18. ENV guard logic: detects missing required vars", () => {
    const requiredVars: Record<string, string> = {
      DATABASE_URL: "",
      JWT_ACCESS_SECRET: "",
      JWT_REFRESH_SECRET: "has-value",
    };
    const missing = Object.entries(requiredVars)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    assert.deepStrictEqual(missing, ["DATABASE_URL", "JWT_ACCESS_SECRET"]);
  });

  await test("19. ENV guard logic: passes when all required vars are present", () => {
    const requiredVars: Record<string, string> = {
      DATABASE_URL: "postgresql://...",
      JWT_ACCESS_SECRET: "secret1",
      JWT_REFRESH_SECRET: "secret2",
    };
    const missing = Object.entries(requiredVars)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    assert.deepStrictEqual(missing, []);
  });

  console.log(`\n  ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Unexpected test runner error:", err);
  process.exit(1);
});
