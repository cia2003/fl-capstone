export function ChatHeader() {
  return (
    <>
      <p className="text-caption font-medium tracking-caption text-primary">FILM COMPASS</p>
      <h1 className="mt-2">What kind of story do you need?</h1>
      <p className="mt-4">Describe a feeling, pace, or theme. Recommendations are ranked against the verified Ghibli film list.</p>
      <div className="mt-6 flex gap-3 align-center justify-center">
        <button className="text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Suggest a film base
        </button>
        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md">
          Reset
        </button>
      </div>
    </>
  );
}
