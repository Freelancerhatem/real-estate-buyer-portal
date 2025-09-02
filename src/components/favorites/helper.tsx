import toast from "react-hot-toast";

export function confirmRemove(action: () => void) {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <span>Remove this property from favorites?</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              action();
            }}
            className="px-2 py-1 rounded bg-rose-600 text-white text-sm hover:bg-rose-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-1 rounded bg-zinc-200 text-sm hover:bg-zinc-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
    }
  );
}
