import { describe, it, expect } from "vitest";

// Smoke test xác nhận test runner (Vitest) chạy được — gỡ sau khi có test thật.
describe("scaffold", () => {
  it("test runner hoạt động", () => {
    expect(1 + 1).toBe(2);
  });
});
