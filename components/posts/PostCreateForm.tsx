"use client";

import { useActionState, useState, useEffect } from "react";
import { PhotoUploader } from "./PhotoUploader";
import { createPost, type PostState } from "@/app/actions/post";
import type { Destination } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

interface PostCreateFormProps {
  destinations: Destination[];
}

const TRAVEL_STYLES = [
  { value: "budget", label: "Budget" },
  { value: "backpacker", label: "Backpacker" },
  { value: "mid_range", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
];

const TRANSPORT_MODES = [
  { value: "flight", label: "Flight" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: "car", label: "Car" },
  { value: "boat", label: "Boat" },
  { value: "mixed", label: "Mixed" },
];

const STAY_TYPES = [
  { value: "hostel", label: "Hostel" },
  { value: "hotel", label: "Hotel" },
  { value: "airbnb", label: "Airbnb" },
  { value: "resort", label: "Resort" },
  { value: "camping", label: "Camping" },
  { value: "mixed", label: "Mixed" },
];

function CostInput({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="0"
          step="1"
          className="w-full rounded-lg border pl-7 pr-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#1D9E75] transition"
          style={{ borderWidth: "0.5px", borderColor: "#d1d5db" }}
          placeholder="0"
        />
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}

export function PostCreateForm({ destinations }: PostCreateFormProps) {
  const [state, action, pending] = useActionState<PostState, FormData>(createPost, null);
  const [photos, setPhotos] = useState<string[]>([]);

  const [costs, setCosts] = useState({
    cost_per_day: "",
    cost_stay: "",
    cost_food: "",
    cost_transport: "",
    cost_activities: "",
    cost_flight: "",
    cost_total: "",
    trip_days: "",
  });

  // Auto-calculate cost_total
  useEffect(() => {
    const nums = [costs.cost_stay, costs.cost_food, costs.cost_transport, costs.cost_activities, costs.cost_flight]
      .map((v) => parseFloat(v) || 0);
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum > 0) setCosts((c) => ({ ...c, cost_total: String(sum) }));
  }, [costs.cost_stay, costs.cost_food, costs.cost_transport, costs.cost_activities, costs.cost_flight]);

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#1D9E75] transition bg-white";
  const inputStyle = { borderWidth: "0.5px", borderColor: "#d1d5db" };
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  function handleSubmit(formData: FormData) {
    photos.forEach((url) => formData.append("photos", url));
    Object.entries(costs).forEach(([k, v]) => {
      if (v) formData.set(k, v);
    });
    action(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Photos */}
      <div>
        <label className={labelClass}>Photos <span className="text-red-400">*</span></label>
        <PhotoUploader photos={photos} onChange={setPhotos} />
        {state?.errors?.photos && (
          <p className="mt-1 text-xs text-red-500">{state.errors.photos[0]}</p>
        )}
      </div>

      {/* Caption */}
      <div>
        <label className={labelClass} htmlFor="caption">
          Caption <span className="text-red-400">*</span>
        </label>
        <textarea
          id="caption"
          name="caption"
          rows={3}
          maxLength={2200}
          className={inputClass}
          style={inputStyle}
          placeholder="Tell the story of your trip..."
        />
        {state?.errors?.caption && (
          <p className="mt-1 text-xs text-red-500">{state.errors.caption[0]}</p>
        )}
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="location_name">
            Location <span className="text-red-400">*</span>
          </label>
          <input
            id="location_name"
            name="location_name"
            type="text"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. Ubud, Bali"
          />
          {state?.errors?.location_name && (
            <p className="mt-1 text-xs text-red-500">{state.errors.location_name[0]}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="destination_id">Destination</label>
          <select
            id="destination_id"
            name="destination_id"
            className={inputClass}
            style={inputStyle}
          >
            <option value="">— none —</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, {d.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trip details */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass} htmlFor="trip_days">Trip days</label>
          <input
            id="trip_days"
            name="trip_days"
            type="number"
            min="1"
            className={inputClass}
            style={inputStyle}
            placeholder="7"
            value={costs.trip_days}
            onChange={(e) => setCosts((c) => ({ ...c, trip_days: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="travel_style">Travel style</label>
          <select id="travel_style" name="travel_style" className={inputClass} style={inputStyle}>
            <option value="">—</option>
            {TRAVEL_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="transport_mode">Transport</label>
          <select id="transport_mode" name="transport_mode" className={inputClass} style={inputStyle}>
            <option value="">—</option>
            {TRANSPORT_MODES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="stay_type">Accommodation</label>
        <select id="stay_type" name="stay_type" className={inputClass} style={inputStyle}>
          <option value="">—</option>
          {STAY_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Cost data */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost breakdown</h3>
        <div className="border rounded-xl p-4 space-y-4" style={{ borderWidth: "0.5px" }}>
          <div className="grid grid-cols-2 gap-4">
            <CostInput
              name="cost_per_day"
              label="Per day (avg)"
              value={costs.cost_per_day}
              onChange={(v) => setCosts((c) => ({ ...c, cost_per_day: v }))}
            />
            <CostInput
              name="cost_flight"
              label="Flights (total)"
              value={costs.cost_flight}
              onChange={(v) => setCosts((c) => ({ ...c, cost_flight: v }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CostInput
              name="cost_stay"
              label="Accommodation (total)"
              value={costs.cost_stay}
              onChange={(v) => setCosts((c) => ({ ...c, cost_stay: v }))}
            />
            <CostInput
              name="cost_food"
              label="Food & drink (total)"
              value={costs.cost_food}
              onChange={(v) => setCosts((c) => ({ ...c, cost_food: v }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CostInput
              name="cost_transport"
              label="Local transport (total)"
              value={costs.cost_transport}
              onChange={(v) => setCosts((c) => ({ ...c, cost_transport: v }))}
            />
            <CostInput
              name="cost_activities"
              label="Activities (total)"
              value={costs.cost_activities}
              onChange={(v) => setCosts((c) => ({ ...c, cost_activities: v }))}
            />
          </div>

          <div className="pt-3 border-t" style={{ borderWidth: "0.5px" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Trip total</span>
              <span className="text-lg font-bold" style={{ color: "#1D9E75" }}>
                {costs.cost_total ? formatCurrency(parseFloat(costs.cost_total)) : "—"}
              </span>
            </div>
            <input type="hidden" name="cost_total" value={costs.cost_total} />
          </div>
        </div>
      </div>

      {state?.message && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending || photos.length === 0}
        className="w-full rounded-lg py-3 text-sm font-semibold text-white transition disabled:opacity-50"
        style={{ backgroundColor: "#1D9E75" }}
      >
        {pending ? "Posting..." : "Share trip"}
      </button>
    </form>
  );
}
