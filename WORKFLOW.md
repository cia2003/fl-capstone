# WORKFLOW.md

## correctness
- Round 1: Successfully created the SearchBar, but it included filler content such as placeholder titles and descriptions, and the component was not reusable.
- Round 2: Better followed the specifications and produced a reusable component.

## accessibility
- Round 1: It had some basic accessibility support, but it was still limited. The input used a visually hidden label and a real submit button, which is good, but the placeholder text was not a strong substitute for a clear persistent label. There was also little feedback for screen reader users after submission.
- Round 2: It was more accessible because the structure was clearer and more semantic. The page used a proper heading hierarchy, descriptive link text, and meaningful image alt text, which made it easier for assistive technologies to understand and navigate.

## edge cases
- Both round 1 and round 2 did not have significant differences in edge-case handling between the two prompts. The selected feature was intentionally small and UI-focused. The reason is because no search functionality had been implemented yet, both versions had nearly identical edge-case behavior. Most potential edge cases (such as empty search results or API errors) were outside the scope of this exercise.

## review effort
- Round 1: Review effort was relatively lighter because there was no AI-generated testing to validate.
- Round 2: Review effort was significantly higher because I had to install dependencies and run tests before reviewing the implementation.