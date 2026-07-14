# WORKFLOW.md

## Draft summary: round-1 vs round-2

This document summarizes the differences between **round-1** and **round-2** based on correctness, accessibility, edge cases, review effort, and the AI mistakes that were identified during implementation.

## Correctness

* **Round 1:** The implementation created a basic search form, but it did not fully match the intended project theme. Instead of focusing on searching for meal names, the generated component was a generic search bar that could be used for any type of search. It also included unnecessary filler content, such as headers and titles, making the component less reusable within the project. As a result, additional modifications would have been required before it could be integrated into the application.

* **Round 2:** The implementation was much closer to the provided specification. The search form was specifically designed for searching meal names, matching the project's meal-planning theme. The generated component was more modular, reusable, and aligned with the expected behavior described in the prompt.

## Accessibility

* **Round 1:** The interface relied only on a placeholder to explain the purpose of the input field. This is not an accessible solution because placeholder text disappears once users start typing and is generally not announced reliably by screen readers, making it difficult for visually impaired users to understand the purpose of the search form.

* **Round 2:** Accessibility received greater attention. The implementation included an `aria-describedby` attribute that provides additional context for screen-reader users, allowing them to understand the purpose and expected usage of the search form more clearly. This resulted in a more accessible and semantically meaningful component.

## Edge Cases

* **Round 1:** The implementation only covered the primary happy path. It handled basic input submission but did not consider situations such as failed searches or displaying appropriate feedback when no matching meals were found.

* **Round 2:** The implementation considered more realistic scenarios, including empty input, invalid input, long search values, repeated submissions, loading and disabled states, as well as appropriate handling when no search results were returned. This made the component more robust and suitable for production-like behavior.

## Review Effort

* **Round 1:** Review effort was relatively low because the implementation was straightforward and no automated tests were generated. However, more manual review was required to identify missing requirements and functionality.

* **Round 2:** Although the initial implementation took longer, the overall review process was more structured because the AI also generated tests. I needed to install the testing dependencies and execute the test suite before reviewing the changes, but this increased my confidence that the implementation behaved as expected.

## AI Mistake Found

One issue I identified was that the AI generated outdated instructions for installing Jest. The suggested testing dependencies were incompatible with the latest version of Next.js used in the project. Instead of following the generated commands, I referred to the official Next.js documentation and installed the recommended testing packages and configuration. This experience reinforced the importance of verifying AI-generated setup instructions against official documentation, especially when working with rapidly evolving frameworks.
