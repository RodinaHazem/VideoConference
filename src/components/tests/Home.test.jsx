import { screen, render, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"

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
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}))

vi.mock("uuid", () => ({
    v4: vi.fn(() => "test-meeting-uuid-1234"),
}))
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

vi.mock("../ui/common/sidebar/Sidebar", () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>,
}))

import Home from "../ui/app/Home"
import { auth } from "../../firebase"
import { addDoc } from "firebase/firestore"
import toast from "react-hot-toast"


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

    // Provide a writable clipboard mock
    Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn(() => Promise.resolve()) },
        writable: true,
        configurable: true,
    })
})

describe("Card titles", () => {
    test("renders 'New Meeting' card title", () => {
        renderHome()
        expect(screen.getByText(/New Meeting/i)).toBeInTheDocument()
    })

    test("renders 'Join Meeting' card title", () => {
        renderHome()
        expect(screen.getByText(/Join Meeting/i)).toBeInTheDocument()
    })

    test("renders 'Schedule Meeting' card title", () => {
        renderHome()
        expect(screen.getByText(/Schedule Meeting/i)).toBeInTheDocument()
    })

    test("renders 'View Recordings' card title", () => {
        renderHome()
        expect(screen.getByText(/View Recordings/i)).toBeInTheDocument()
    })
})


describe("Card subtitles", () => {
    test("renders 'Setup a new recording' subtitle under New Meeting", () => {
        renderHome()
        expect(screen.getByText(/Setup a new recording/i)).toBeInTheDocument()
    })

    test("renders 'via invitation link' subtitle under Join Meeting", () => {
        renderHome()
        expect(screen.getByText(/via invitation link/i)).toBeInTheDocument()
    })

    test("renders 'Plan your meeting' subtitle under Schedule Meeting", () => {
        renderHome()
        expect(screen.getByText(/Plan your meeting/i)).toBeInTheDocument()
    })

    test("renders 'Managing recordings' subtitle under View Recordings", () => {
        renderHome()
        expect(screen.getByText(/Managing recordings/i)).toBeInTheDocument()
    })
})

describe("Live clock overlay", () => {
    test("renders the current year in the date overlay", () => {
        renderHome()
        const year = new Date().getFullYear().toString()
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    })

    test("renders a time string in 12-hour AM/PM format", () => {
        renderHome()
        expect(screen.getByText(/\d{2}:\d{2}\s*(AM|PM)/i)).toBeInTheDocument()
    })
})


describe("Sidebar", () => {
    test("renders the Sidebar component", () => {
        renderHome()
        expect(screen.getByTestId("sidebar")).toBeInTheDocument()
    })
})

describe("New Meeting – unauthenticated user", () => {
    beforeEach(() => {
        auth.currentUser = null
    })

    test("shows an error toast when not logged in", () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        expect(toast.error).toHaveBeenCalledWith("Please login first")
    })

    test("does NOT navigate when not logged in", () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        expect(mockNavigate).not.toHaveBeenCalled()
    })

    test("does NOT call addDoc when not logged in", () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        expect(addDoc).not.toHaveBeenCalled()
    })

    test("does NOT write to clipboard when not logged in", () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    })
})

describe("New Meeting – authenticated user", () => {
    beforeEach(() => {
        auth.currentUser = { email: "user@example.com" }
    })

    afterEach(() => {
        auth.currentUser = null
    })

    test("navigates to /VideoCall/<uuid> after creating a meeting", async () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
                "/VideoCall/test-meeting-uuid-1234"
            )
        })
    })

    test("calls addDoc to persist the meeting in Firestore", async () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        await waitFor(() => {
            expect(addDoc).toHaveBeenCalled()
        })
    })

    test("copies the meeting link (containing the uuid) to clipboard", async () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                expect.stringContaining("test-meeting-uuid-1234")
            )
        })
    })

    test("does NOT show an error toast when logged in", () => {
        renderHome()
        fireEvent.click(screen.getByText(/New Meeting/i))
        expect(toast.error).not.toHaveBeenCalled()
    })
})
