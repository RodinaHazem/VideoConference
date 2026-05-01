import { screen, render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Login from "../auth/Login"
import { vi } from "vitest"

vi.mock("../../firebase", () => ({
    auth: {},
}))

vi.mock("firebase/auth", () => ({
    signInWithEmailAndPassword: vi.fn(),
}))


test("renders login page", () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
})