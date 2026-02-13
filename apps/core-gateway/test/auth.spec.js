"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../src/routes/auth"));
function getPaths() {
    const stack = auth_1.default.stack || [];
    const paths = [];
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
