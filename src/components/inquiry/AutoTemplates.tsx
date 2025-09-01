"use client";

/**
 * AutoTemplates
 * - Small helper that lets users insert canned messages into the composer.
 * - Emits `onInsertTemplate(text)` to parent.
 */

const TEMPLATES = [
  "Is this still available?",
  "Can we schedule a visit this weekend?",
  "Could you share HOA fees and disclosures?",
  "We'd like to submit an offer. Please advise next steps.",
];

type Props = {
  onInsertTemplate?: (text: string) => void;
};

export default function AutoTemplates({ onInsertTemplate }: Props) {
  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-medium mb-3">Auto templates</h3>
      <ul className="space-y-2">
        {TEMPLATES.map((t) => (
          <li key={t} className="flex items-center justify-between gap-2">
            <p className="text-sm">{t}</p>
            <button
              className="rounded border px-2 py-1 text-xs hover:bg-zinc-50"
              onClick={() => onInsertTemplate?.(t)}
            >
              Insert
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
