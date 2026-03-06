import { describe, it, expect } from "vitest";
import { validateContactForm, VALID_SURFACES } from "@/lib/validation";

/* ─── Helpers ─────────────────────────────────────────────── */

const valid = {
  name: "Jane O'Brien",
  email: "jane@example.com",
  phone: "+1 (416) 555-1234",
  surface: "marble",
  message: "Kitchen island, 8ft slab.",
};

/* ─── Happy path ──────────────────────────────────────────── */

describe("validateContactForm", () => {
  it("accepts valid input", () => {
    const r = validateContactForm(valid);
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("trims whitespace from all fields", () => {
    const r = validateContactForm({
      ...valid,
      name: "  Jane  ",
      email: " jane@example.com ",
    });
    expect(r.valid).toBe(true);
    expect(r.data.name).toBe("Jane");
    expect(r.data.email).toBe("jane@example.com");
  });

  it("strips control characters (null bytes, etc.)", () => {
    const r = validateContactForm({
      ...valid,
      name: "Jane\x00\x0B",
      message: "Hello\x7Fworld",
    });
    expect(r.data.name).toBe("Jane");
    expect(r.data.message).toBe("Helloworld");
  });

  it("accepts optional empty phone and message", () => {
    const r = validateContactForm({ ...valid, phone: "", message: "" });
    expect(r.valid).toBe(true);
  });

  /* ─── Name ────────────────────────────────────────────── */

  it("rejects missing name", () => {
    const r = validateContactForm({ ...valid, name: "" });
    expect(r.valid).toBe(false);
    expect(r.errors[0].field).toBe("name");
  });

  it("rejects name with digits", () => {
    const r = validateContactForm({ ...valid, name: "Jane123" });
    expect(r.valid).toBe(false);
    expect(r.errors[0].field).toBe("name");
  });

  it("rejects name with angle brackets (XSS probe)", () => {
    const r = validateContactForm({ ...valid, name: "<script>alert(1)</script>" });
    expect(r.valid).toBe(false);
  });

  /* ─── Email ───────────────────────────────────────────── */

  it("rejects missing email", () => {
    const r = validateContactForm({ ...valid, email: "" });
    expect(r.valid).toBe(false);
    expect(r.errors[0].field).toBe("email");
  });

  it("rejects email without domain", () => {
    const r = validateContactForm({ ...valid, email: "jane@" });
    expect(r.valid).toBe(false);
  });

  it("rejects email with spaces", () => {
    const r = validateContactForm({ ...valid, email: "jane @example.com" });
    expect(r.valid).toBe(false);
  });

  it("rejects email with angle brackets (header injection)", () => {
    const r = validateContactForm({ ...valid, email: "jane@example.com<>" });
    expect(r.valid).toBe(false);
  });

  /* ─── Phone ───────────────────────────────────────────── */

  it("rejects phone with letters", () => {
    const r = validateContactForm({ ...valid, phone: "call-me-maybe" });
    expect(r.valid).toBe(false);
    expect(r.errors[0].field).toBe("phone");
  });

  it("rejects phone too short", () => {
    const r = validateContactForm({ ...valid, phone: "123" });
    expect(r.valid).toBe(false);
  });

  /* ─── Surface allowlist ───────────────────────────────── */

  it("accepts every valid surface", () => {
    for (const surface of VALID_SURFACES) {
      const r = validateContactForm({ ...valid, surface });
      expect(r.valid).toBe(true);
    }
  });

  it("rejects empty surface", () => {
    const r = validateContactForm({ ...valid, surface: "" });
    expect(r.valid).toBe(false);
    expect(r.errors[0].field).toBe("surface");
  });

  it("rejects arbitrary surface value (injection attempt)", () => {
    const r = validateContactForm({ ...valid, surface: "'; DROP TABLE users;--" });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.field === "surface")).toBe(true);
  });

  /* ─── Edge cases ──────────────────────────────────────── */

  it("handles non-string input gracefully", () => {
    const r = validateContactForm({
      name: 42,
      email: null,
      phone: undefined,
      surface: true,
      message: [],
    });
    expect(r.valid).toBe(false);
    expect(r.data.name).toBe("");
  });

  it("truncates oversized message to 1000 chars", () => {
    const r = validateContactForm({
      ...valid,
      message: "x".repeat(5000),
    });
    expect(r.data.message).toHaveLength(1000);
  });

  it("collects multiple errors at once", () => {
    const r = validateContactForm({
      name: "",
      email: "",
      phone: "abc",
      surface: "invalid",
      message: "",
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThanOrEqual(4);
  });
});
