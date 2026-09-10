import { fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { describe, expect, it, vi, type Mock } from "vitest"

import { AIMessage } from "@/components/features/recommend/ChatMessages/AIMessage"
import ChatComposer from "@/components/features/recommend/ChatMessages/ChatComposer"
import ChatMessages from "@/components/features/recommend/ChatMessages/ChatMessages"
import ToolState from "@/components/features/recommend/Tools/ToolState"
import type { FilmUIMessage } from "@/types/chat"

vi.mock("@/hooks/useAutoScroll", () => ({
  __esModule: true,
  default: () => ({
    showScrollButton: false,
    scrollToLatest: vi.fn(),
  }),
}))

type MockChat = {
  messages: FilmUIMessage[]
  loading: boolean
  isThinking: boolean
  isStreaming: boolean
  error: Error | null
  responseError: string | null
  status: "ready" | "submitted" | "streaming" | "error"
  bottomRef: ReturnType<typeof createRef<HTMLDivElement>>
  newChat: Mock
  regenerate: Mock
  addToolOutput: Mock
  setMessages: Mock
  submitPreference: Mock
  sendMessage: Mock
  stop: Mock
}

function createChat(overrides: Partial<MockChat> = {}): MockChat {
  return {
    messages: [],
    loading: false,
    isThinking: false,
    isStreaming: false,
    error: null,
    responseError: null,
    status: "ready",
    bottomRef: createRef<HTMLDivElement>(),
    newChat: vi.fn(),
    regenerate: vi.fn(),
    addToolOutput: vi.fn(),
    setMessages: vi.fn(),
    submitPreference: vi.fn(() => false),
    sendMessage: vi.fn(),
    stop: vi.fn(),
    ...overrides,
  }
}

function message(
  role: "user" | "assistant",
  parts: FilmUIMessage["parts"],
): FilmUIMessage {
  return {
    id: `${role}-1`,
    role,
    parts,
  } as FilmUIMessage
}

describe("chat message renderer", () => {
  it("shows the pending thinking state", () => {
    const chat = createChat({ loading: true, isThinking: true })

    render(<ChatMessages chat={chat as never} films={[]} addToolOutput={vi.fn()} />)

    expect(screen.getByText("AI is thinking")).toBeTruthy()
  })

  it("renders a streaming assistant message and its supported tool part", () => {
    const chatMessage = message("assistant", [
      { type: "text", text: "A partial answer" },
      { type: "tool-recommendMovies", toolCallId: "tool-1", state: "input-streaming" },
      { type: "unknown-part" } as never,
    ])

    render(
      <AIMessage
        message={chatMessage}
        films={[]}
        loading={true}
        onNewChat={vi.fn()}
        addToolOutput={vi.fn()}
      />,
    )

    expect(screen.getByText("A partial answer")).toBeTruthy()
    expect(screen.getByRole("status").textContent).toContain("Movie tool result")
  })

  it("shows a recoverable error message", () => {
    const chat = createChat({
      responseError: JSON.stringify({ error: "The response was incomplete." }),
    })

    render(<ChatMessages chat={chat as never} films={[]} addToolOutput={vi.fn()} />)

    expect(screen.getByText("The response was incomplete.")).toBeTruthy()
    expect((screen.getByRole("button", { name: "Regenerate response" }) as HTMLButtonElement).disabled).toBe(false)
  })
})

describe("chat composer", () => {
  it("validates an empty form and submits a non-empty query", () => {
    const chat = createChat()
    const composerRef = createRef<HTMLDivElement>()

    render(<ChatComposer chat={chat as never} composerRef={composerRef} />)

    const input = screen.getByLabelText("What are you in the mood for?")
    fireEvent.submit(input.closest("form") as HTMLFormElement)
    expect(chat.sendMessage).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: "A quiet seaside story" } })
    fireEvent.submit(input.closest("form") as HTMLFormElement)

    expect(chat.sendMessage).toHaveBeenCalledWith({ text: "A quiet seaside story" })
  })

  it("stops generation instead of submitting while loading", () => {
    const chat = createChat({ loading: true })

    render(<ChatComposer chat={chat as never} composerRef={createRef<HTMLDivElement>()} />)

    const stopButton = screen.getByRole("button", { name: "Stop generating response" })
    fireEvent.click(stopButton)

    expect(chat.stop).toHaveBeenCalledTimes(1)
    expect(chat.sendMessage).not.toHaveBeenCalled()
  })
})

describe("tool result", () => {
  it("renders available tool output for the user", () => {
    render(
      <ToolState
        state="output-available"
        title="Movie recommendations"
        outputContent={<p>Found three films for you.</p>}
      />,
    )

    expect(screen.getByText("Found three films for you.")).toBeTruthy()
  })
})
