import { type Locator, type Page } from "@playwright/test";

export class ChatPage {
  readonly page: Page;
  readonly input: Locator;
  readonly sendButton: Locator;
  readonly errorMessage: Locator;
  readonly thinkingIndicator: Locator;
  readonly stopButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.input = page.getByLabel(
      "What are you in the mood for?"
    );

    this.sendButton = page.getByRole("button", {
      name: "Send message",
    });

    this.errorMessage = page.locator(
        'p[role="alert"].text-primary'
    )

    this.thinkingIndicator = page.getByTestId("thinking-indicator");

    this.stopButton = page.getByRole("button", {
      name: "Stop generating response",
    });

  }

  async createNewChat() {
    await this.page.goto("/find-my-film");
  }

  async sendUserMessage(message: string) {
    await this.input.fill(message);
    await this.sendButton.click();
  }

  async isGenerationStarted() {
    await this.page
      .getByRole("button", {
        name: "Stop generating response",
      })
      .waitFor();
  }

  async isStreaming() {
    await this.page
      .getByRole("button", {
        name: "Stop generating response",
      })
      .waitFor();
  }

  async hasError() {
    return this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    return this.errorMessage.innerText();
  }
}