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
    const surfaceGroup = view.getByRole("radiogroup", { name: /countertop/ });
    const radios = within(surfaceGroup).getAllByRole("radio");
    expect(radios).toHaveLength(6);
    expect(radios.map((r) => r.textContent)).toEqual([
      "Marble", "Quartz", "Granite", "Quartzite", "Porcelain", "Solid Surface",
    ]);
  });

  it("starts with auto-rotation active — one surface is highlighted", () => {
    const { view } = renderFinder();
    const surfaceGroup = view.getByRole("radiogroup", { name: /countertop/ });
    const radios = within(surfaceGroup).getAllByRole("radio");
    const checkedRadios = radios.filter(
      (r) => r.getAttribute("aria-checked") === "true",
    );
    // Auto-rotation should highlight exactly one surface
    expect(checkedRadios).toHaveLength(1);
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
    const group = view.getByRole("radiogroup", { name: /countertop/ });
    expect(group).toHaveAttribute("aria-label", "Select your countertop surface type");
  });

  it("has an aria-live region for dynamic result announcements", () => {
    const { container } = renderFinder();
    const liveRegion = container.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeInTheDocument();
  });

  it("renders rotation mode toggle with Auto and Diverse options", () => {
    const { view } = renderFinder();
    const modeGroup = view.getByRole("radiogroup", { name: "Rotation mode" });
    const modeButtons = within(modeGroup).getAllByRole("radio");
    expect(modeButtons).toHaveLength(2);
    expect(modeButtons[0]).toHaveTextContent("Auto");
    expect(modeButtons[1]).toHaveTextContent("Diverse");
    // Auto is default
    expect(modeButtons[0]).toHaveAttribute("aria-checked", "true");
    expect(modeButtons[1]).toHaveAttribute("aria-checked", "false");
  });

  it("switches to Diverse mode and still shows a surface", async () => {
    const user = userEvent.setup();
    const { view } = renderFinder();
    const diverseBtn = view.getByRole("radio", { name: "Diverse" });
    await user.click(diverseBtn);
    expect(diverseBtn).toHaveAttribute("aria-checked", "true");
    // Auto-rotation should still highlight one surface pill
    const surfaceRadios = within(
      view.getByRole("radiogroup", { name: /countertop/ }),
    ).getAllByRole("radio");
    const checked = surfaceRadios.filter(
      (r) => r.getAttribute("aria-checked") === "true",
    );
    expect(checked).toHaveLength(1);
  });
});
