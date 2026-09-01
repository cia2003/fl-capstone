# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chat.test.ts >> chat failure handling >> stops streaming when user clicks stop
- Location: tests\chat.test.ts:107:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(received).resolves.toBe()

Received promise rejected instead of resolved
Rejected to value: [Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Stop generating response' }) to be visible
]
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
      - paragraph [ref=e13]: I want a gentle movie
      - generic [ref=e14]:
        - generic [ref=e15]: What are you in the mood for?
        - generic [ref=e16]:
          - textbox "What are you in the mood for?" [active] [ref=e17]:
            - /placeholder: I want a gentle, hopeful adventure…
          - button "Send message" [ref=e18] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e27] [cursor=pointer]
  - alert [ref=e31]
```

# Test source

```ts
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
  104 |       .toBe(true);
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
> 118 |     await expect(chatPage.isStreaming()).resolves.toBe(false);
      |                                                   ^ Error: expect(received).resolves.toBe()
  119 |   });
  120 | });
```