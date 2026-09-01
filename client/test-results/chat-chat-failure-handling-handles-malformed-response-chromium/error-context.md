# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chat.test.ts >> chat failure handling >> handles malformed response
- Location: tests\chat.test.ts:95:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - navigation "Main navigation" [ref=e3]:
      - link "Ghibli Compass" [ref=e4] [cursor=pointer]:
        - /url: /
      - generic [ref=e5]:
        - link "Health" [ref=e6] [cursor=pointer]:
          - /url: /health
        - link "Finding" [ref=e7] [cursor=pointer]:
          - /url: /find-my-film
        - link "Watchlist" [ref=e8] [cursor=pointer]:
          - /url: /watchlist
  - main [ref=e9]:
    - generic [ref=e10]:
      - generic [ref=e11]:
        - paragraph [ref=e13]: Recommend me a movie
        - generic [ref=e15]:
          - paragraph [ref=e16]: I found a few Studio Ghibli films that match what you're looking for.
          - list [ref=e18]:
            - listitem [ref=e19]:
              - paragraph [ref=e20]: "#1 match · 98%"
              - heading "Spirited Away (2001)" [level=3] [ref=e21]:
                - text: Spirited Away
                - generic [ref=e22]: (2001)
              - paragraph [ref=e23]: A timeless magical adventure full of wonder, spirits, and unforgettable characters, perfect for anyone looking for a masterpiece.
              - link "Check verified film details" [ref=e24] [cursor=pointer]:
                - /url: /films/dc2e6bd1-8156-4886-adff-b39e6043af0c
            - listitem [ref=e25]:
              - paragraph [ref=e26]: "#2 match · 95%"
              - heading "My Neighbor Totoro (1988)" [level=3] [ref=e27]:
                - text: My Neighbor Totoro
                - generic [ref=e28]: (1988)
              - paragraph [ref=e29]: A heartwarming, gentle classic celebrating nature, family, and childhood wonder.
              - link "Check verified film details" [ref=e30] [cursor=pointer]:
                - /url: /films/58611129-2dbc-4a81-a72f-77ddfc1b1b49
            - listitem [ref=e31]:
              - paragraph [ref=e32]: "#3 match · 92%"
              - heading "Howl's Moving Castle (2004)" [level=3] [ref=e33]:
                - text: Howl's Moving Castle
                - generic [ref=e34]: (2004)
              - paragraph [ref=e35]: A dazzling, romantic fantasy featuring breathtaking magic and a charmingly eccentric cast.
              - link "Check verified film details" [ref=e36] [cursor=pointer]:
                - /url: /films/cd3d059c-09f4-4ff3-8d63-bc765a5184fa
      - generic [ref=e37]:
        - generic [ref=e38]: What are you in the mood for?
        - generic [ref=e39]:
          - textbox "What are you in the mood for?" [ref=e40]:
            - /placeholder: I want a gentle, hopeful adventure…
          - button "Stop generating response" [active] [ref=e41] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e49] [cursor=pointer]
  - alert [ref=e53]
```

# Test source

```ts
  4   | import { ChatPage } from "./pages/chat";
  5   | import { injectServerError } from "./test-scenarios/error";
  6   | import { injectRateLimit } from "./test-scenarios/rate-limit";
  7   | import { injectSlowResponse } from "./test-scenarios/slow";
  8   | import { injectStreamError } from "./test-scenarios/stream-error";
  9   | import { injectNetworkFailure } from "./test-scenarios/network-error";
  10  | import { injectMalformedResponse } from "./test-scenarios/malformed-response";
  11  | 
  12  | test.describe("chat failure handling", () => {
  13  |   let chatPage: ChatPage;
  14  | 
  15  |   test.beforeEach(async ({ page }) => {
  16  |     chatPage = new ChatPage(page);
  17  | 
  18  |     await chatPage.createNewChat();
  19  |   });
  20  | 
  21  |   test("can access chat", async () => {
  22  |     await expect(chatPage.input).toBeVisible()
  23  |   })
  24  | 
  25  |   test("handles server error", async ({ page }) => {
  26  |     await injectServerError(page);
  27  | 
  28  |     await chatPage.sendUserMessage(
  29  |       "Recommend me a movie"
  30  |     );
  31  | 
  32  |     const errorMessage = await chatPage.getErrorMessage()
  33  | 
  34  |     await expect(errorMessage).toBe(
  35  |       "{\"error\":\"This is a test server error\"}"
  36  |     )
  37  |   });
  38  | 
  39  |   test("handles rate limit", async ({ page }) => {
  40  |     await injectRateLimit(page);
  41  | 
  42  |     await chatPage.sendUserMessage(
  43  |       "Recommend me a movie"
  44  |     );
  45  | 
  46  |     const errorMessage = await chatPage.getErrorMessage()
  47  | 
  48  |     await expect(errorMessage).toBe(
  49  |       "{\"error\":\"Too many requests\"}"
  50  |     )
  51  |   });
  52  | 
  53  |   test("shows thinking indicator during slow response", async ({
  54  |     page,
  55  |   }) => {
  56  |     await injectSlowResponse(page);
  57  | 
  58  |     await chatPage.sendUserMessage(
  59  |       "Recommend me a movie"
  60  |     );
  61  | 
  62  |     await chatPage.isGenerationStarted();
  63  | 
  64  |     await expect(chatPage.thinkingIndicator).toBeVisible();
  65  | 
  66  |     await expect(chatPage.thinkingIndicator).toBeHidden({
  67  |       timeout: 15000
  68  |     });
  69  |   });
  70  | 
  71  |   test("handles stream error", async ({ page }) => {
  72  |     await injectStreamError(page)
  73  | 
  74  |     await chatPage.sendUserMessage("Hello")
  75  | 
  76  |     await expect
  77  |       .poll(() => chatPage.hasError(), {
  78  |         timeout: 3000,
  79  |       })
  80  |       .toBe(true)
  81  |   })
  82  | 
  83  |   test("handles network failure before response", async ({ page }) => {
  84  |     await injectNetworkFailure(page)
  85  | 
  86  |     await chatPage.sendUserMessage(
  87  |       "Recommend me a movie"
  88  |     );
  89  | 
  90  |     await expect
  91  |       .poll(() => chatPage.hasError())
  92  |       .toBe(true);
  93  |   });
  94  | 
  95  |   test("handles malformed response", async ({ page }) => {
  96  |     await injectMalformedResponse(page)
  97  | 
  98  |     await chatPage.sendUserMessage(
  99  |       "Recommend me a movie"
  100 |     );
  101 | 
  102 |     await expect
  103 |       .poll(() => chatPage.hasError())
> 104 |       .toBe(true);
      |        ^ Error: expect(received).toBe(expected) // Object.is equality
  105 |   })
  106 | 
  107 |   test("stops streaming when user clicks stop", async () => {
  108 |     await chatPage.sendUserMessage(
  109 |       "I want a gentle movie"
  110 |     );
  111 | 
  112 |     await expect(chatPage.stopButton).toBeVisible();
  113 | 
  114 |     await chatPage.stopButton.click();
  115 | 
  116 |     await expect(chatPage.stopButton).toBeHidden();
  117 | 
  118 |     await expect(chatPage.isStreaming()).resolves.toBe(false);
  119 |   });
  120 | });
```