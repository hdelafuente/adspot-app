"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllAdSpots, deactivateAdSpot } from "@/lib/api";
import { type AdSpot, type Placement, PLACEMENTS } from "@/lib/types";

const PLACEMENT_COLORS: Record<Placement, string> = {
  home_screen: "bg-blue-100 text-blue-700",
  ride_summary: "bg-purple-100 text-purple-700",
  map_view: "bg-teal-100 text-teal-700",
};

const PLACEMENT_LABELS: Record<Placement, string> = {
  home_screen: "Home Screen",
  ride_summary: "Ride Summary",
  map_view: "Map View",
};

function PlacementBadge({ placement }: { placement: Placement }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PLACEMENT_COLORS[placement]}`}
    >
      {PLACEMENT_LABELS[placement]}
    </span>
  );
}

function StatusBadge({ status }: { status: AdSpot["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
        status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "active" ? "bg-green-500" : "bg-red-400"
        }`}
      />
      {status === "active" ? "Activo" : "Inactivo"}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded" />
      ))}
    </div>
  );
}

export default function AdSpotTable() {
  const [adspots, setAdspots] = useState<AdSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [placementFilter, setPlacementFilter] = useState<Placement | "">("");
  const [deactivating, setDeactivating] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllAdSpots()
      .then(setAdspots)
      .catch((err: Error) => toast.error(`Error al cargar: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id: string, title: string) => {
    setDeactivating(id);
    try {
      const updated = await deactivateAdSpot(id);
      setAdspots((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(`"${title}" desactivado correctamente`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al desactivar");
    } finally {
      setDeactivating(null);
    }
  };

  const filtered =
    placementFilter
      ? adspots.filter((s) => s.placement === placementFilter)
      : adspots;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Placement:</label>
        <select
          value={placementFilter}
          onChange={(e) => setPlacementFilter(e.target.value as Placement | "")}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos</option>
          {PLACEMENTS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <span className="ml-auto text-sm text-gray-400">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No hay Ad Spots para mostrar</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Título", "Imagen", "Placement", "Estado", "TTL (min)", "Creado", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((spot) => (
                <tr
                  key={spot.id}
                  className={`transition-colors ${
                    spot.status === "inactive" ? "bg-gray-50 opacity-70" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Title */}
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                    {spot.title}
                  </td>

                  {/* Image thumbnail */}
                  <td className="px-4 py-3">
                    <img
                      src={spot.imageUrl}
                      alt={spot.title}
                      className="h-9 w-14 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='36'%3E%3Crect width='56' height='36' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%239ca3af'%3EN/A%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </td>

                  {/* Placement */}
                  <td className="px-4 py-3">
                    <PlacementBadge placement={spot.placement} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={spot.status} />
                  </td>

                  {/* TTL */}
                  <td className="px-4 py-3 text-gray-500">
                    {spot.ttlMinutes ?? <span className="text-gray-300">—</span>}
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(spot.createdAt).toLocaleString("es-AR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    {spot.status === "active" && (
                      <button
                        onClick={() => handleDeactivate(spot.id, spot.title)}
                        disabled={deactivating === spot.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deactivating === spot.id ? (
                          <>
                            <span className="animate-spin">↻</span> Desactivando…
                          </>
                        ) : (
                          "Desactivar"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
