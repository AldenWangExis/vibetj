"use client";

import { useActionState } from "react";
import { createMapMarker } from "@/app/map/actions";
import type { MapCoordinate } from "@/types/map";
import { useEffect } from "react";

interface SaveLocationFormProps {
  location: MapCoordinate;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialState = {
  success: false as const,
  error: "",
};

export function SaveLocationForm({ location, onCancel, onSuccess }: SaveLocationFormProps) {
  const [state, formAction, isPending] = useActionState(createMapMarker, initialState);

  // 监听成功状态
  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <div className="p-4 space-y-4 bg-surface border border-border rounded-lg">
      <h3 className="text-lg font-medium text-text-primary">Save Location</h3>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="lat" value={location.lat} />
        <input type="hidden" name="lng" value={location.lng} />

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-text-secondary">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full bg-background border border-border rounded px-3 py-2 text-text-primary focus:border-white focus:outline-none transition-colors"
            placeholder="Enter location name..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm text-text-secondary">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="w-full bg-background border border-border rounded px-3 py-2 text-text-primary focus:border-white focus:outline-none transition-colors"
            placeholder="Optional address..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm text-text-secondary">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full bg-background border border-border rounded px-3 py-2 text-text-primary focus:border-white focus:outline-none transition-colors min-h-[80px]"
            placeholder="Add notes..."
          />
        </div>

        {state?.error && <p className="text-sm text-accent-red">{state.error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm border border-border rounded hover:bg-border/50 text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
