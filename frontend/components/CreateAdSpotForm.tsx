"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAdSpot } from "@/lib/api";
import { type Placement, PLACEMENTS } from "@/lib/types";

interface FormState {
  title: string;
  imageUrl: string;
  placement: Placement | "";
  ttlMinutes: string;
}

const INITIAL: FormState = {
  title: "",
  imageUrl: "",
  placement: "",
  ttlMinutes: "",
};

function Field({
  label,
  required,
  hint,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400";

export default function CreateAdSpotForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) next.title = "El título es requerido";
    else if (form.title.length > 255) next.title = "Máximo 255 caracteres";

    if (!form.imageUrl.trim()) {
      next.imageUrl = "La URL de imagen es requerida";
    } else {
      try {
        new URL(form.imageUrl);
      } catch {
        next.imageUrl = "Debe ser una URL válida (ej: https://…)";
      }
    }

    if (!form.placement) next.placement = "Seleccioná un placement";

    if (form.ttlMinutes !== "") {
      const n = Number(form.ttlMinutes);
      if (!Number.isInteger(n) || n < 1 || n > 10080)
        next.ttlMinutes = "Debe ser un número entre 1 y 10080 (1 semana)";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createAdSpot({
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
        placement: form.placement as Placement,
        ...(form.ttlMinutes !== "" && { ttlMinutes: Number(form.ttlMinutes) }),
      });
      toast.success("Ad Spot creado correctamente");
      router.push("/adspots");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear el Ad Spot");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg">
      {/* Title */}
      <Field label="Título" required error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Ej: Promo verano 2026"
          disabled={submitting}
          className={inputCls}
        />
      </Field>

      {/* Image URL */}
      <Field
        label="URL de imagen"
        required
        hint="URL pública de la imagen del anuncio"
        error={errors.imageUrl}
      >
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://cdn.example.com/banner.png"
          disabled={submitting}
          className={inputCls}
        />
        {/* Preview */}
        {form.imageUrl && !errors.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="mt-2 h-16 rounded border border-gray-200 object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            onLoad={(e) => ((e.target as HTMLImageElement).style.display = "block")}
          />
        )}
      </Field>

      {/* Placement */}
      <Field label="Placement" required error={errors.placement}>
        <select
          value={form.placement}
          onChange={(e) => set("placement", e.target.value)}
          disabled={submitting}
          className={inputCls}
        >
          <option value="">Seleccioná un placement…</option>
          {PLACEMENTS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      {/* TTL */}
      <Field
        label="TTL (minutos)"
        hint="Opcional. El anuncio expirará automáticamente después de este tiempo."
        error={errors.ttlMinutes}
      >
        <input
          type="number"
          min={1}
          max={10080}
          value={form.ttlMinutes}
          onChange={(e) => set("ttlMinutes", e.target.value)}
          placeholder="Ej: 60"
          disabled={submitting}
          className={inputCls}
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {submitting ? (
            <>
              <span className="animate-spin">↻</span> Creando…
            </>
          ) : (
            "Crear Ad Spot"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/adspots")}
          disabled={submitting}
          className="px-4 py-2.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
