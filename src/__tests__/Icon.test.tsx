import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Icon, { type IconName } from "@/components/Icon";

const ALL_ICONS: IconName[] = [
  "star", "shield", "bolt", "check", "alert",
  "beaker", "dollar", "chevron-down", "image",
];

describe("Icon", () => {
  it("renders all 9 registered icons without crashing", () => {
    for (const name of ALL_ICONS) {
      const { unmount } = render(<Icon name={name} />);
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // Every icon must produce a non-empty path
      const path = svg?.querySelector("path");
      expect(path?.getAttribute("d")).toBeTruthy();
      unmount();
    }
  });

  it("marks all icons as decorative with aria-hidden", () => {
    render(<Icon name="shield" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("uses 20x20 viewBox and fill for the filled star icon", () => {
    const { container } = render(<Icon name="star" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 20 20");
    expect(svg.getAttribute("fill")).toBe("currentColor");
    // Filled icons must NOT have a stroke
    expect(svg.getAttribute("stroke")).toBeNull();
  });

  it("uses 24x24 viewBox and stroke for outlined icons", () => {
    const outlinedIcons: IconName[] = ["shield", "bolt", "check", "alert"];
    for (const name of outlinedIcons) {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
      expect(svg.getAttribute("fill")).toBe("none");
      expect(svg.getAttribute("stroke")).toBe("currentColor");
      unmount();
    }
  });

  it("applies custom className and strokeWidth", () => {
    const { container } = render(
      <Icon name="check" className="w-8 h-8" strokeWidth={3} />
    );
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("w-8", "h-8");
    const path = svg.querySelector("path")!;
    expect(path.getAttribute("stroke-width")).toBe("3");
  });

  it("does not add stroke attributes to filled icons regardless of strokeWidth prop", () => {
    const { container } = render(<Icon name="star" strokeWidth={5} />);
    const path = container.querySelector("path")!;
    // star is filled — strokeWidth prop should be ignored
    expect(path.getAttribute("stroke-width")).toBeNull();
    expect(path.getAttribute("stroke-linecap")).toBeNull();
  });
});
