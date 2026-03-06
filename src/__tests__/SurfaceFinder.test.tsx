import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import SurfaceFinder from "@/components/SurfaceFinder";

function renderFinder() {
  const result = render(<SurfaceFinder />);
  const view = within(result.container);
  return { ...result, view };
}

describe("SurfaceFinder", () => {
  it("renders all 6 surface options as radio buttons", () => {
    const { view } = renderFinder();
    const radios = view.getAllByRole("radio");
    expect(radios).toHaveLength(6);
    expect(radios.map((r) => r.textContent)).toEqual([
      "Marble", "Quartz", "Granite", "Quartzite", "Porcelain", "Solid Surface",
    ]);
  });

  it("starts with no selection and shows empty-state prompt", () => {
    const { view } = renderFinder();
    const radios = view.getAllByRole("radio");
    for (const radio of radios) {
      expect(radio).toHaveAttribute("aria-checked", "false");
    }
    expect(view.getByText(/Tap a surface above/)).toBeInTheDocument();
  });

  it("selects a surface and shows its profile", async () => {
    const user = userEvent.setup();
    const { view } = renderFinder();

    await user.click(view.getByRole("radio", { name: "Marble" }));

    expect(view.getByRole("radio", { name: "Marble" }))
      .toHaveAttribute("aria-checked", "true");
    expect(view.getByText(/diva of countertops/)).toBeInTheDocument();
    expect(view.getByText("High Risk")).toBeInTheDocument();
    expect(view.getByText(/Acid etching/)).toBeInTheDocument();
    expect(view.getByRole("link", { name: /Get a Quote/ }))
      .toHaveAttribute("href", "#contact");
  });

  it("toggles selection off when clicking the same surface", async () => {
    const user = userEvent.setup();
    const { view } = renderFinder();

    await user.click(view.getByRole("radio", { name: "Granite" }));
    expect(view.getByText(/Natural stone/)).toBeInTheDocument();

    await user.click(view.getByRole("radio", { name: "Granite" }));
    expect(view.getByText(/Tap a surface above/)).toBeInTheDocument();
  });

  it("switches between surfaces without stale state", async () => {
    const user = userEvent.setup();
    const { view } = renderFinder();

    await user.click(view.getByRole("radio", { name: "Quartz" }));
    expect(view.getByText(/Engineered tough/)).toBeInTheDocument();

    await user.click(view.getByRole("radio", { name: "Porcelain" }));
    expect(view.getByText(/Sleek and modern/)).toBeInTheDocument();
    expect(view.queryByText(/Engineered tough/)).not.toBeInTheDocument();
  });

  it("wraps surface pills in a radiogroup with accessible label", () => {
    const { view } = renderFinder();
    const group = view.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-label", "Select your countertop surface type");
  });

  it("has an aria-live region for dynamic result announcements", () => {
    const { container } = renderFinder();
    const liveRegion = container.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeInTheDocument();
  });
});
