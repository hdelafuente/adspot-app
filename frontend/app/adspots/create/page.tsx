import Link from "next/link";
import CreateAdSpotForm from "@/components/CreateAdSpotForm";

export const metadata = { title: "Crear Ad Spot — AdSpot Manager" };

export default function CreateAdSpotPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/adspots"
          className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-3"
        >
          ← Volver a Ad Spots
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Crear Ad Spot</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completá el formulario para agregar un nuevo anuncio al sistema.
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <CreateAdSpotForm />
      </div>
    </div>
  );
}
