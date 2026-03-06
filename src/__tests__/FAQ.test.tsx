import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import FAQ from "@/components/FAQ";

function renderFAQ() {
  const result = render(<FAQ />);
  const view = within(result.container);
  return { ...result, view };
}

describe("FAQ", () => {
  it("renders all 8 questions as accordion triggers", () => {
    const { view } = renderFAQ();
    const buttons = view.getAllByRole("button");
    expect(buttons).toHaveLength(8);
    expect(buttons[0]).toHaveTextContent("What is surface protection film?");
  });

  it("all accordions start collapsed (aria-expanded=false)", () => {
    const { view } = renderFAQ();
    const buttons = view.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("expands a question and reveals the answer", async () => {
    const user = userEvent.setup();
    const { view } = renderFAQ();

    const trigger = view.getAllByRole("button")[3]; // "Is the film food-safe?"
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(view.getByText(/FDA-compliant/)).toBeInTheDocument();
  });

  it("only one accordion open at a time", async () => {
    const user = userEvent.setup();
    const { view } = renderFAQ();

    const [first, second] = view.getAllByRole("button");
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");

    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("collapses when clicking the same question twice", async () => {
    const user = userEvent.setup();
    const { view } = renderFAQ();

    const trigger = view.getAllByRole("button")[0];
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("each trigger has aria-controls pointing to a valid panel", () => {
    const { container } = renderFAQ();
    const buttons = within(container).getAllByRole("button");
    for (let i = 0; i < buttons.length; i++) {
      const panelId = buttons[i].getAttribute("aria-controls");
      expect(panelId).toBe(`faq-panel-${i}`);
      expect(container.querySelector(`[id="${panelId}"]`)).toBeTruthy();
    }
  });

  it("panels have region role with aria-labelledby back to their trigger", () => {
    const { view } = renderFAQ();
    const regions = view.getAllByRole("region");
    expect(regions).toHaveLength(8);
    for (let i = 0; i < regions.length; i++) {
      expect(regions[i]).toHaveAttribute("aria-labelledby", `faq-trigger-${i}`);
    }
  });
});
