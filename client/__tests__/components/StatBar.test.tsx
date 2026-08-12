import { render, screen } from "@testing-library/react";
import { StatBar } from "../../components/ui/StatBar";

describe("StatBar", () => {
  it("renders the label and value", () => {
    render(<StatBar label="Energy" value={75} />);

    expect(screen.getByText("Energy")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
  });
});
