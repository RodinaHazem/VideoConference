import { screen, render, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock("../../firebase", () => ({
    auth: { currentUser: null },
    db: {},
}))

vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    addDoc: vi.fn(() => Promise.resolve()),
    serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
}))

vi.mock("react-hot-toast", () => ({
    default: { error: vi.fn(), success: vi.fn() },
}))

vi.mock("uuid", () => ({
    v4: vi.fn(() => "test-meeting-uuid-1234"),
}))

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock("../ui/common/sidebar/Sidebar", () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>,
}))

// ── Imports (must come after vi.mock calls) ────────────────────────────────
import Home from "../ui/app/Home"
import { auth } from "../../firebase"
import { addDoc } from "firebase/firestore"
import toast from "react-hot-toast"

// ── Helpers ────────────────────────────────────────────────────────────────
function renderHome() {
    return render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    )
}

beforeEach(() => {
    mockNavigate.mockClear()
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(addDoc).mockClear()
    Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn(() => Promise.resolve()) },
        writable: true,
        configurable: true,
    })
})

// ── Card titles ────────────────────────────────────────────────────────────
// Use getByRole('heading') to avoid false matches on the modal title/button
describe("Card titles", () => {
  test("renders 'New Meeting' card title", () => {
    renderHome()
    expect(screen.getByRole("heading", { name: /New Meeting/i })).toBeInTheDocument()
  })

  test("renders 'Join Meeting' card title", () => {
    renderHome()
    // getAllByRole because the modal also has a 'Join Meeting' heading; we just need at least one
    expect(screen.getAllByRole("heading", { name: /Join Meeting/i })[0]).toBeInTheDocument()
  })

  test("renders 'Schedule Meeting' card title", () => {
    renderHome()
    expect(screen.getByRole("heading", { name: /Schedule Meeting/i })).toBeInTheDocument()
  })

  test("renders 'View Recordings' card title", () => {
    renderHome()
    expect(screen.getByRole("heading", { name: /View Recordings/i })).toBeInTheDocument()
  })
})

// ── Card subtitles ─────────────────────────────────────────────────────────
describe("Card subtitles", () => {
    test.each([
        ["Start a new video conference"],
        ["Connect using a meeting code"],
        ["Plan your meeting"],
        ["Managing recordings"],
    ])("renders subtitle '%s'", (subtitle) => {
        renderHome()
        expect(screen.getByText(new RegExp(subtitle, "i"))).toBeInTheDocument()
    })
})

// ── Live clock overlay ─────────────────────────────────────────────────────
describe("Live clock overlay", () => {
    test("renders current year in the date overlay", () => {
        renderHome()
        expect(
            screen.getByText(new RegExp(new Date().getFullYear().toString()))
        ).toBeInTheDocument()
    })

    test("renders time in 12-hour AM/PM format", () => {
        renderHome()
        expect(screen.getByText(/\d{2}:\d{2}\s*(AM|PM)/i)).toBeInTheDocument()
    })
})

// ── Sidebar ────────────────────────────────────────────────────────────────
test("renders the Sidebar component", () => {
    renderHome()
    expect(screen.getByTestId("sidebar")).toBeInTheDocument()
})

// ── New Meeting – unauthenticated ──────────────────────────────────────────
describe("New Meeting – unauthenticated user", () => {
    beforeEach(() => { auth.currentUser = null })

    test("shows an error toast when not logged in", () => {
        renderHome()
        // Click the card heading, not the modal button
        fireEvent.click(screen.getByRole("heading", { name: /New Meeting/i }))
        expect(toast.error).toHaveBeenCalledWith("Please login first")
    })

    test("does NOT navigate, call addDoc, or write clipboard when not logged in", () => {
        renderHome()
        fireEvent.click(screen.getByRole("heading", { name: /New Meeting/i }))
        expect(mockNavigate).not.toHaveBeenCalled()
        expect(addDoc).not.toHaveBeenCalled()
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    })
})

// ── New Meeting – authenticated ────────────────────────────────────────────
describe("New Meeting – authenticated user", () => {
    beforeEach(() => { auth.currentUser = { email: "user@example.com" } })
    afterEach(() => { auth.currentUser = null })

    test("navigates to /VideoCall/<uuid> and persists meeting in Firestore", async () => {
        renderHome()
        fireEvent.click(screen.getByRole("heading", { name: /New Meeting/i }))
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/VideoCall/test-meeting-uuid-1234")
            expect(addDoc).toHaveBeenCalled()
        })
    })

    test("copies meeting link containing uuid to clipboard", async () => {
        renderHome()
        fireEvent.click(screen.getByRole("heading", { name: /New Meeting/i }))
        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                expect.stringContaining("test-meeting-uuid-1234")
            )
        })
    })

    test("does NOT show an error toast when logged in", () => {
        renderHome()
        fireEvent.click(screen.getByRole("heading", { name: /New Meeting/i }))
        expect(toast.error).not.toHaveBeenCalled()
    })
})
