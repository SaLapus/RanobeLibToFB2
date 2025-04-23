import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Search } from "../../pages/Search/Search";

vi.mock("../../utils/api", () => ({
  fetchQueryTitles: vi.fn().mockResolvedValue([
    {
      id: 1,
      rus_name: "Test Novel",
      type: "Novel",
      status: "Ongoing",
      year: "2024",
      slug_url: "test-novel",
      cover: {
        default: "test.jpg",
        thumb: "test-thumb.jpg",
      },
    },
  ]),
}));

describe("Search component", () => {
  it("renders search input", () => {
    render(<Search />);
    expect(
      screen.getByPlaceholderText("Искать вашу любимую новеллу")
    ).toBeInTheDocument();
  });

  it("shows loading spinner while fetching", async () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Искать вашу любимую новеллу");

    fireEvent.change(input, { target: { value: "test" } });

    const spinner = screen.getByRole("status");

    await waitFor(
      () => {
        expect(spinner).toHaveAttribute("data-loading", "true");
      },
      {
        container: spinner,
        timeout: 8_000,
      }
    );

    await waitFor(() => {
      expect(spinner).toHaveAttribute("data-loading", "false");
    });
  });

  it("displays search results when API returns data", async () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Искать вашу любимую новеллу");

    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(screen.getByText("Test Novel")).toBeInTheDocument();
    });
  });
});
