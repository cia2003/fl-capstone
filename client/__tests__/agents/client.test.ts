import { compareBreeds, interpretBreed } from "../../agents/client";

describe("agent client", () => {
  it("returns an interpretation payload placeholder", async () => {
    const result = await interpretBreed();
    expect(result).toHaveProperty("message");
  });

  it("returns a comparison payload placeholder", async () => {
    const result = await compareBreeds();
    expect(result).toHaveProperty("message");
  });
});
