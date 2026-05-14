import { describe, test, expect, vi } from "vitest";
import renderer from "react-test-renderer";
import AddVolunteer from "../AddVolunteer";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("AddVolunteer Component", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<AddVolunteer />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});