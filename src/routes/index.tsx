import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proof of Process — Document your authentic writing" },
      {
        name: "description",
        content:
          "Instead of proving your work isn't AI, document how you actually wrote it. Proof of Process turns your drafts into a shareable authorship portfolio.",
      },
      { property: "og:title", content: "Proof of Process" },
      {
        property: "og:description",
        content: "Document the evolution of your writing to prove authentic authorship.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(oklch(0.3_0.1_240)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            A tool for honest writers
          </div>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Don't prove it isn't AI.
            <br />
            <span className="text-gradient">Prove it's yours.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            AI detectors are unreliable and biased. Proof of Process helps students document the
            real evolution of their writing — drafts, revisions, second thoughts — so authorship
            speaks for itself.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Start a new portfolio
              <span aria-hidden>→</span>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* 3-step */}
      <section id="how" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              The Process
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Three steps to demonstrable authorship.</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Paste your drafts",
                d: "Add every version of your work — from the messy first attempt to the polished final piece.",
              },
              {
                n: "02",
                t: "See your evolution",
                d: "A side-by-side diff shows exactly what you changed, cut, and rethought between drafts.",
              },
              {
                n: "03",
                t: "Get a shareable portfolio",
                d: "Export a clean, timestamped record you can send to a teacher or reviewer.",
              },
            ].map((s) => (
              <li key={s.n} className="card-elevated relative rounded-xl p-8">
                <div className="font-display text-5xl font-light text-teal/60">{s.n}</div>
                <h3 className="mt-4 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Why this matters
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Detection is broken. Process isn't.</h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-foreground/80 md:col-span-3">
            <p>
              Stanford researchers found that widely-used GPT detectors flagged more than half of
              essays written by non-native English speakers as AI-generated — while essays by
              native speakers passed almost untouched.
            </p>
            <p>
              Detection tools guess. A documented writing process shows. Proof of Process gives
              honest students a way to answer the question <em>"did you really write this?"</em>{" "}
              with evidence instead of anxiety.
            </p>
            <div className="rounded-lg border-l-2 border-teal bg-surface-muted px-5 py-4 text-sm text-muted-foreground">
              This is a tool for writers, not a surveillance instrument. Your drafts belong to you.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="hero-gradient relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16">
          <h2 className="text-3xl text-primary-foreground sm:text-4xl">
            Ready to document your process?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Build your first portfolio in a few minutes. No account required.
          </p>
          <Link
            to="/create"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-card px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-card/90"
          >
            Start a new portfolio
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
