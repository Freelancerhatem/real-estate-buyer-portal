"use client";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  // simple window of pages
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1.5 rounded border bg-white disabled:opacity-50"
      >
        Prev
      </button>

      {pages[0] !== 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1.5 rounded border bg-white"
          >
            1
          </button>
          <span className="px-1 text-gray-500">…</span>
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 rounded border ${
            p === page ? "bg-primary text-white border-primary" : "bg-white"
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] !== totalPages && (
        <>
          <span className="px-1 text-gray-500">…</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1.5 rounded border bg-white"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={next}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded border bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
