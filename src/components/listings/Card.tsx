"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaBath,
  FaArrowsAltH,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import toast from "react-hot-toast";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useFavorite } from "@/hooks/useFavorite";
import { useCollections } from "@/hooks/useCollections";
import type { listing } from "@/types/listing";

type Props = {
  listing: listing;
  badge?: string;
  timeAgo?: string;
};

const ListingCard: React.FC<Props> = ({ listing, badge }) => {
  const {
    _id: propertyId,
    thumbnail,
    title,
    location,
    totalBedrooms,
    totalBathrooms,
    totalArea,
    price,
  } = listing;

  const { user, loading: authLoading } = useUnifiedAuth();
  const isAuthed = !!(user?._id ?? user?.id);

  // Favorites
  const {
    isFavorite,
    loading: favLoading,
    toggle,
  } = useFavorite({
    propertyId,
    initOnMount: false,
  });

  const onToggleFavorite = async () => {
    if (!isAuthed) {
      toast.error("Please log in to save favorites");
      return;
    }
    const ok = await toggle({
      onSuccess: (fav) =>
        toast.success(fav ? "Added to favorites" : "Removed from favorites"),
      onError: () => toast.error("Something went wrong. Please try again."),
    });
    if (!ok) return;
  };

  // Collections
  const {
    collections,
    loading: colLoading,
    refresh,
    createCollection,
    addToCollection,
  } = useCollections({
    initOnMount: false,
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const busy = favLoading || authLoading || colLoading || creating;

  const openPicker = async () => {
    if (!isAuthed) {
      toast.error("Please log in to use collections");
      return;
    }
    setPickerOpen(true);
    await refresh();
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Collection name is required");
      return;
    }
    try {
      setCreating(true);
      const created = await createCollection(newName.trim());
      setSelectedId(created._id);
      setNewName("");
      toast.success("Collection created");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedId) {
      toast.error("Please select a collection");
      return;
    }
    try {
      await addToCollection(selectedId, propertyId);
      toast.success("Added to collection");
      setPickerOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add to collection");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-full relative">
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover w-full h-full"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        )}

        {badge && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold shadow-md">
            {badge}
          </span>
        )}

        {/* Favorite */}
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={busy}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md focus:outline-none hover:bg-rose-50 disabled:opacity-60"
        >
          <FaHeart
            className={`text-lg sm:text-xl transition-colors ${
              isFavorite ? "text-rose-600" : "text-gray-400"
            }`}
          />
        </button>

        {/* Add to Collection */}
        <button
          type="button"
          onClick={openPicker}
          disabled={busy}
          title="Add to collection"
          className="absolute bottom-2 right-12 bg-white p-2 rounded-full shadow-md focus:outline-none hover:bg-zinc-50 disabled:opacity-60"
        >
          <CiBookmark className="text-xl text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
          {title}
        </h2>

        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <FaMapMarkerAlt className="text-sm" />
          <span>{location?.country ?? "—"}</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-gray-700 pt-2">
          <div className="flex items-center space-x-1">
            <FaBed />
            <span>{totalBedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaBath />
            <span>{totalBathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaArrowsAltH />
            <span>{totalArea} sqft</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
            {typeof price === "number" ? `$${price.toLocaleString()}` : "—"}
          </span>
          <Link
            href={`/listings/property/${propertyId}`}
            className="inline-block"
          >
            <button
              type="button"
              className="bg-primary text-white text-xs sm:text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-hover focus:outline-none focus:ring-2 focus:ring-hover"
            >
              View Details
            </button>
          </Link>
        </div>
      </div>

      {/* Add to Collection Popover */}
      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-10"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white shadow-lg p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Add to Collection</h3>
              <button
                onClick={() => setPickerOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            {/* Existing collections */}
            <div className="max-h-48 overflow-auto border rounded-md">
              {colLoading ? (
                <div className="p-3 text-sm text-gray-500">Loading…</div>
              ) : collections.length ? (
                collections.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 p-2 border-b last:border-b-0 cursor-pointer hover:bg-zinc-50"
                  >
                    <input
                      type="radio"
                      name="collection"
                      value={c._id}
                      checked={selectedId === c._id}
                      onChange={() => setSelectedId(c._id)}
                    />
                    <span className="text-sm">{c.name}</span>
                    {c.isDefault ? (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 border">
                        default
                      </span>
                    ) : null}
                  </label>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">
                  No collections yet.
                </div>
              )}
            </div>

            {/* Create new */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New collection name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 border rounded-md px-2 py-1 text-sm"
              />
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="px-3 py-1.5 rounded-md bg-zinc-900 text-white text-sm disabled:opacity-60"
              >
                Create
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setPickerOpen(false)}
                className="px-3 py-1.5 rounded-md border text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCollection}
                disabled={!selectedId || busy}
                className="px-3 py-1.5 rounded-md bg-primary text-white text-sm disabled:opacity-60"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingCard;
