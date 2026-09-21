"use client";

export function SkipLink() {
  const focusMain = () => {
    document.getElementById("main-content")?.focus();
  };

  return (
    <a
      href="#main-content"
      onClick={focusMain}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      className="sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:not-sr-only focus-visible:rounded-button focus-visible:bg-background focus-visible:px-button-x focus-visible:py-button-y focus-visible:font-semibold focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Skip to main content
    </a>
  );
}
