import { screen, render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

// Mock firebase to prevent crashes in jsdom
vi.mock("../../firebase", () => ({
    auth: {},
}))

vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn(),
}))

import SignUp from "../auth/SignUp"

test("renders signup page with all fields", () => {
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i)
    const passwordInput = screen.getByPlaceholderText(/Create a password/i)
    const submitButton = screen.getByRole("button", { name: /Sign Up/i })

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
})

test("signup button is enabled by default", () => {
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    )
    const submitButton = screen.getByRole("button", { name: /Sign Up/i })
    expect(submitButton).not.toBeDisabled()
})
