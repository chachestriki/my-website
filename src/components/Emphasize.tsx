export function Emphasize({ text, words }: { text: string; words: string[] }) {
  const unique = [...new Set(words.map((word) => word.trim()).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  if (unique.length === 0) return text;

  const pattern = unique.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const parts = text.split(new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, "giu"));

  return parts.map((part, index) =>
    unique.some((word) => word.toLowerCase() === part.toLowerCase()) ? <b key={index}>{part}</b> : part,
  );
}
