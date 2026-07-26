import type { CSSProperties } from "react";

/* =========================
   INPUT
========================= */

export const inputClass =
  "w-full border p-2 rounded transition-colors";

export const inputStyle: CSSProperties = {
  background: "var(--card-bg)",
  color: "var(--foreground)",
  borderColor: "var(--nav-border)",
};

/* =========================
   CARD
========================= */

export const cardStyle: CSSProperties = {
  background: "var(--card-bg)",
  color: "var(--foreground)",
  borderColor: "var(--nav-border)",
};

/* =========================
   THEME
========================= */

export const getColorScheme = (): "dark" | "light" => {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains(
    "theme-dark"
  )
    ? "dark"
    : "light";
};

/* =========================
   DATETIME INPUT
========================= */

export const getDateTimeInputStyle =
  (): CSSProperties => ({
    ...inputStyle,
    colorScheme: getColorScheme(),
  });

/* =========================
   IMAGE PREVIEW
========================= */

export const imagePreviewStyle: CSSProperties = {
  borderColor: "var(--nav-border)",
};

/* =========================
   IMAGE REMOVE BUTTON
========================= */

export const imageRemoveButtonStyle: CSSProperties = {
  background: "rgba(0,0,0,.65)",
  color: "#fff",
};

/* =========================
   IMAGE UPLOAD
========================= */

export const getImageUploadStyle = (
  hasError: boolean
): CSSProperties => ({
  background: "var(--card-bg)",
  borderColor: hasError
    ? "#ef4444"
    : "var(--nav-border)",
  color: "var(--foreground)",
});

/* =========================
   DETAIL IMAGE UPLOAD
========================= */

export const detailImageUploadStyle: CSSProperties = {
  background: "var(--card-bg)",
  borderColor: "var(--nav-border)",
  color: "var(--foreground)",
};

/* =========================
   LOADING
========================= */

export const loadingStyle: CSSProperties = {
  color: "var(--foreground)",
};

/* =========================
   SUBMIT BUTTON
========================= */

export const getSubmitButtonStyle = (
  submitting: boolean
): CSSProperties => ({
  background: submitting
    ? "var(--text-muted)"
    : "var(--color-primary)",

  color:
    getColorScheme() === "dark"
      ? "#000"
      : "#fff",

  opacity:
    submitting
      ? 0.7
      : 1,
});
