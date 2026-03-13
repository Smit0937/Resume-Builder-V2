import { vi, test, expect } from "vitest";

// ─── MOCK axios before importing api ───
vi.mock("axios", () => ({
  default: {
    defaults: {},
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

import axios from "axios";
import api, { API_URL } from "../services/api";

// ────────── TESTS ──────────

// 1. API_URL falls back to "/api" when env var is missing
test("API_URL defaults to /api", () => {
  expect(API_URL).toBe("/api");
});

// 2. axios.create was called with correct config
test("axios.create is called with baseURL and withCredentials", () => {
  expect(axios.create).toHaveBeenCalledWith({
    baseURL: "/api",
    withCredentials: true,
  });
});

// 3. api is the instance returned by axios.create
test("api is the axios instance", () => {
  expect(api).toBeDefined();
  expect(typeof api.get).toBe("function");
  expect(typeof api.post).toBe("function");
});
