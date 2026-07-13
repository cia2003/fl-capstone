# WORKFLOW.md

## Draft summary: round-1 vs round-2
This draft summarizes the difference between branch round-1 and branch round-2 using the review criteria of correctness, accessibility, edge cases, and review effort.

## correctness
- Round 1: The implementation was able to create a basic search experience, but it still included filler content, such as headers or titles, and the component was not yet reusable.
- Round 2: The implementation is more aligned with the requested specification because it is more structured and closer to a reusable component approach.

## accessibility
- Round 1: The UI was functional, but it needed stronger semantic structure and clearer interaction support for keyboard and screen-reader users.
- Round 2: The review should focus on whether labels, focus states, and form semantics are clear enough for accessible usage.

## edge cases
- Round 1: Important edge cases include empty input, repeated submissions, and cases where no result is shown.
- Round 2: The review should also consider empty states, long input values, invalid input, and loading or disabled states.

## review effort
- Round 1: Review effort was lighter because the implementation was simpler and there was no testing created by the AI to validate behavior.
- Round 2: Review effort was significantly higher because I had to install dependencies and run tests before I could confidently review the changes.