import authRouter from "../src/routes/auth";

function getPaths(): string[] {
  const stack = (authRouter as any).stack || [];
  const paths: string[] = [];
  for (const layer of stack) {
    if (layer.route && layer.route.path) {
      paths.push(layer.route.path);
    }
  }
  return paths.sort();
}

const paths = getPaths();
const required = ["/register", "/login", "/refresh", "/logout", "/me"].sort();

if (JSON.stringify(paths.filter((p) => required.includes(p))) !== JSON.stringify(required)) {
  throw new Error("auth routes missing");
}

