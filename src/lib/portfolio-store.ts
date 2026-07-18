export type Draft = {
  id: string;
  label: string;
  content: string;
};

export type Portfolio = {
  title: string;
  reflection: string;
  drafts: Draft[];
  createdAt: string;
  summary?: string;
};

const KEY = "pop:portfolio";

export function savePortfolio(p: Portfolio) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function loadPortfolio(): Portfolio | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Portfolio;
  } catch {
    return null;
  }
}

export function clearPortfolio() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

// Simple word-level diff (LCS-based) for mock display.
export type DiffToken = { type: "same" | "add" | "remove"; text: string };

export function diffWords(a: string, b: string): DiffToken[] {
  const aw = a.split(/(\s+)/);
  const bw = b.split(/(\s+)/);
  const n = aw.length;
  const m = bw.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (aw[i] === bw[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffToken[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (aw[i] === bw[j]) {
      out.push({ type: "same", text: aw[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "remove", text: aw[i] });
      i++;
    } else {
      out.push({ type: "add", text: bw[j] });
      j++;
    }
  }
  while (i < n) out.push({ type: "remove", text: aw[i++] });
  while (j < m) out.push({ type: "add", text: bw[j++] });
  return out;
}
