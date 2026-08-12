'use client'

export default function Page() {
  return (
    <main role="main" className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <section className="py-8 md:py-16 text-center">
        <h1 className="font-heading text-h1 font-semibold">Welcome to landing page</h1>

        <a href="/profile" className="font-body text-body font-semibold leading-relaxed text-blue-500">Go to Lifestyle Intake page</a>

        <br />

        <a href="/breeds" className="font-body text-body font-semibold leading-relaxed text-blue-500">Go breeds page</a>
      </section>
    </main>
  );
}