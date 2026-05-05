import { screen, render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

// Mock firebase auth to provide a fake signOut
vi.mock("../../firebase", () => ({
    auth: {
        signOut: vi.fn(() => Promise.resolve()),
    },
}))

import Home from "../ui/Home"

test("renders home page with Logout and VideoCall buttons", () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    )

    const logoutButton = screen.getByRole("button", { name: /Logout/i })
    const videoCallButton = screen.getByRole("button", { name: /VideoCall/i })

    expect(logoutButton).toBeInTheDocument()
    expect(videoCallButton).toBeInTheDocument()
})
