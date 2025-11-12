"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const current = theme === "system" ? resolvedTheme : theme;

  if (!current) {
    return null;
  }

  const isDark = current === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-sm font-medium text-foreground transition hover:border-[var(--color-accent)]"
    >
      {isDark ? "Light" : "Dark"} mode
    </button>
  );
}
