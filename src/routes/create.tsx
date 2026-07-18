import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { savePortfolio, type Draft } from "@/lib/portfolio-store";

async function extractDocxText(file: File): Promise<string> {
  // @ts-expect-error - no types for browser bundle
  const mammoth = await import("mammoth/mammoth.browser");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value as string).trim();
}



export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Portfolio — Proof of Process" },
      {
        name: "description",
        content: "Add your drafts and revisions to build a portfolio of your writing process.",
      },
    ],
  }),
  component: Create,
});

const DEFAULT_LABELS = ["Draft 1", "Revision", "Final"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [reflection, setReflection] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([
    { id: uid(), label: "Draft 1", content: "" },
    { id: uid(), label: "Revision", content: "" },
  ]);
  type UploadState = { loading?: boolean; error?: string; fileName?: string };
  const [uploadState, setUploadState] = useState<Record<string, UploadState>>({});


  const filledCount = drafts.filter((d) => d.content.trim().length > 0).length;
  const progress = useMemo(
    () => Math.min(100, Math.round((filledCount / Math.max(drafts.length, 1)) * 100)),
    [filledCount, drafts.length]
  );

  const canSubmit = title.trim().length > 0 && filledCount >= 2;

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  function addDraft() {
    const next = DEFAULT_LABELS[drafts.length] ?? `Draft ${drafts.length + 1}`;
    setDrafts((prev) => [...prev, { id: uid(), label: next, content: "" }]);
  }

  function removeDraft(id: string) {
    setDrafts((prev) => (prev.length <= 2 ? prev : prev.filter((d) => d.id !== id)));
  }

  async function handleUpload(id: string, file: File | null | undefined) {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (name.endsWith(".doc") && !name.endsWith(".docx")) {
      setUploadState((s) => ({ ...s, [id]: { error: "Legacy .doc files aren't supported. Save as .docx." } }));
      return;
    }
    if (!name.endsWith(".docx")) {
      setUploadState((s) => ({ ...s, [id]: { error: "Only .docx files are supported." } }));
      return;
    }

    setUploadState((s) => ({ ...s, [id]: { loading: true } }));
    try {
      const text = await extractDocxText(file);
      updateDraft(id, { content: text, label: file.name.replace(/\.docx$/i, "") });
      setUploadState((s) => ({ ...s, [id]: { fileName: file.name } }));
    } catch (err) {
      console.error(err);
      setUploadState((s) => ({ ...s, [id]: { error: "Couldn't read that file." } }));
    }
  }


  function submit() {
    if (!canSubmit) return;
    savePortfolio({
      title: title.trim(),
      reflection: reflection.trim(),
      drafts: drafts.filter((d) => d.content.trim().length > 0),
      createdAt: new Date().toISOString(),
    });
    navigate({ to: "/portfolio" });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
          New portfolio
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Document your process.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Paste each version of your piece in the order you wrote it. The more honest the
          progression, the stronger the record.
        </p>
      </header>

      {/* Progress */}
      <div className="mb-10 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {filledCount} of {drafts.length} drafts filled
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-teal transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium">Essay / piece title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. On Memory and Migration"
          className="w-full rounded-md border border-input bg-card px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Drafts */}
      <div className="space-y-6">
        {drafts.map((d, i) => (
          <div key={d.id} className="card-elevated rounded-xl p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <input
                  value={d.label}
                  onChange={(e) => updateDraft(d.id, { label: e.target.value })}
                  className="rounded border-none bg-transparent px-1 text-lg font-medium outline-none focus:bg-surface-muted"
                />
              </div>
              {drafts.length > 2 && (
                <button
                  onClick={() => removeDraft(d.id)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              )}
            </div>
            <textarea
              value={d.content}
              onChange={(e) => updateDraft(d.id, { content: e.target.value })}
              placeholder="Paste this version of your writing here…"
              rows={8}
              className="w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:border-teal hover:text-teal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {uploadState[d.id]?.loading ? "Reading…" : "Upload .docx"}
                  <input
                    type="file"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      handleUpload(d.id, f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {uploadState[d.id]?.fileName && !uploadState[d.id]?.error && (
                  <span className="text-muted-foreground">
                    Loaded <span className="font-medium text-foreground">{uploadState[d.id]!.fileName}</span>
                  </span>
                )}
                {uploadState[d.id]?.error && (
                  <span className="text-destructive">{uploadState[d.id]!.error}</span>
                )}
              </div>
              <span className="text-muted-foreground">
                {d.content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

          </div>
        ))}
      </div>

      <button
        onClick={addDraft}
        className="mt-4 w-full rounded-xl border border-dashed border-border bg-transparent py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-teal hover:bg-surface-muted hover:text-teal"
      >
        + Add another draft
      </button>

      {/* Reflection */}
      <div className="mt-10">
        <label className="mb-2 block text-sm font-medium">
          Reflection <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <p className="mb-3 text-sm text-muted-foreground">
          Why did you make these changes? A few sentences in your own voice.
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={5}
          placeholder="I rewrote the opening because…"
          className="w-full resize-y rounded-md border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <p className="text-xs text-muted-foreground">
          {canSubmit
            ? "Ready when you are."
            : "Add a title and at least two drafts to generate your portfolio."}
        </p>
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate my portfolio
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
