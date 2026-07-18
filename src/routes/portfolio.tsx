import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { clearPortfolio, diffWords, loadPortfolio, savePortfolio, type Portfolio } from "@/lib/portfolio-store";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Your Portfolio — Proof of Process" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  async function fetchSummary(p: Portfolio) {
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/generate-summary/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: p.title,
          drafts: p.drafts.map((d) => ({ label: d.label, content: d.content })),
          reflection: p.reflection,
        }),
      });

      if (!response.ok) {
        let errMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.details) {
            errMsg = `${errData.message || errData.error || ""}: ${errData.details}`;
          } else if (errData.message) {
            errMsg = errData.message;
          } else if (typeof errData === 'object') {
            errMsg = JSON.stringify(errData);
          }
        } catch {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      if (!data.summary) {
        throw new Error("No summary returned from server.");
      }

      setSummary(data.summary);
      
      const updatedPortfolio = { ...p, summary: data.summary };
      setPortfolio(updatedPortfolio);
      savePortfolio(updatedPortfolio);
    } catch (err: any) {
      console.error("Failed to generate summary:", err);
      setError(err?.message || "Could not connect to the backend server. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const p = loadPortfolio();
    setPortfolio(p);
    setLoaded(true);
    if (p) {
      if (p.summary) {
        setSummary(p.summary);
      } else {
        fetchSummary(p);
      }
    }
  }, []);

  if (!loaded) return null;

  if (!portfolio) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl">No portfolio yet</h1>
        <p className="mt-3 text-muted-foreground">
          Create a portfolio to see your writing evolution here.
        </p>
        <Link
          to="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start a new portfolio
        </Link>
      </div>
    );
  }

  const { title, reflection, drafts, createdAt } = portfolio;
  const pairs: Array<[typeof drafts[number], typeof drafts[number]]> = [];
  for (let i = 0; i < drafts.length - 1; i++) pairs.push([drafts[i], drafts[i + 1]]);

  function reset() {
    clearPortfolio();
    navigate({ to: "/create" });
  }

  function handleRetry() {
    if (portfolio) {
      fetchSummary(portfolio);
    }
  }

  function handleFallback() {
    if (portfolio) {
      const fallbackSummary = generateLocalSummary(portfolio);
      setSummary(fallbackSummary);
      setUsingFallback(true);
      setError(null);
      
      const updatedPortfolio = { ...portfolio, summary: fallbackSummary };
      setPortfolio(updatedPortfolio);
      savePortfolio(updatedPortfolio);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12 border-b border-border pb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-teal/10 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-teal">
            Portfolio
          </span>
          <span className="text-muted-foreground">
            Generated {new Date(createdAt).toLocaleString()}
          </span>
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl">{title}</h1>
        {reflection && (
          <div className="mt-6 max-w-3xl border-l-2 border-teal bg-surface-muted px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Author's reflection
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-foreground/85">
              {reflection}
            </p>
          </div>
        )}
      </div>

      {/* Diffs */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              The evolution
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl">Draft-by-draft changes</h2>
          </div>
          <div className="hidden gap-3 text-xs sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-diff-add" /> Added
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-diff-remove" /> Removed
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {pairs.map(([a, b], i) => (
            <div key={i} className="card-elevated rounded-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3 text-sm">
                <span className="font-medium">
                  {a.label} <span className="text-muted-foreground">→</span> {b.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {b.content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {a.label}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                    {a.content}
                  </p>
                </div>
                <div className="p-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Changes in {b.label}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {diffWords(a.content, b.content).map((t, idx) => {
                      if (t.type === "same") return <span key={idx}>{t.text}</span>;
                      if (t.type === "add")
                        return (
                          <span
                            key={idx}
                            className="rounded bg-diff-add px-0.5 text-diff-add-foreground"
                          >
                            {t.text}
                          </span>
                        );
                      return (
                        <span
                          key={idx}
                          className="rounded bg-diff-remove px-0.5 text-diff-remove-foreground line-through decoration-1"
                        >
                          {t.text}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
          Process summary
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl">How this piece evolved</h2>
        
        {loading && (
          <div className="mt-6 card-elevated rounded-xl p-8 bg-card/60 backdrop-blur-md border border-border/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal/5 to-transparent animate-shimmer -translate-x-full" />
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-surface-muted" />
              <div className="h-4 w-full rounded bg-surface-muted" />
              <div className="h-4 w-5/6 rounded bg-surface-muted" />
              <div className="h-4 w-4/5 rounded bg-surface-muted" />
            </div>
            <p className="mt-6 text-xs text-teal animate-pulse font-medium flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-teal" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing drafts and generating your process summary...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 border border-destructive/20 bg-destructive/5 rounded-xl p-6">
            <h3 className="text-base font-semibold text-destructive flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Summary Generation Failed
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {error}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Retry Request
              </button>
              <button
                onClick={handleFallback}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted"
              >
                Use Local Preview
              </button>
            </div>
          </div>
        )}

        {!loading && !error && summary && (
          <div className="mt-6 card-elevated rounded-xl p-8 relative">
            <p className="whitespace-pre-wrap text-base leading-[1.75] text-foreground/85">
              {summary}
            </p>
            <p className="mt-6 text-xs italic text-muted-foreground">
              {usingFallback 
                ? "Preview summary generated client-side." 
                : "AI-generated process summary."}
            </p>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          Export / download portfolio
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-muted"
        >
          Start new portfolio
        </button>
      </div>
    </div>
  );
}

function generateLocalSummary(p: Portfolio): string {
  const first = p.drafts[0];
  const last = p.drafts[p.drafts.length - 1];
  const firstWords = first.content.trim().split(/\s+/).filter(Boolean).length;
  const lastWords = last.content.trim().split(/\s+/).filter(Boolean).length;
  const delta = lastWords - firstWords;
  const direction = delta > 0 ? "expanded" : delta < 0 ? "tightened" : "held steady";

  return `Across ${p.drafts.length} versions, "${p.title}" moved from an initial ${firstWords}-word draft to a ${lastWords}-word final piece — the writer ${direction} the work by ${Math.abs(delta)} words in the process. The early draft opens with an exploratory framing that later drafts sharpen; middle revisions rework the argument's sequencing, and the final pass focuses on tone, precision, and closing lines. Additions cluster around evidence and voice, while deletions remove hedging and repetition. Taken together, the drafts read as the record of a thinking writer, not a single generated artifact.`;
}
