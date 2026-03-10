import AdSpotTable from "@/components/AdSpotTable";

export const metadata = { title: "Ad Spots — AdSpot Manager" };

export default function AdSpotsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ad Spots</h1>
        <p className="mt-1 text-sm text-gray-500">
          Lista de todos los anuncios. Podés desactivar los spots activos desde esta pantalla.
        </p>
      </div>
      <AdSpotTable />
    </div>
  );
}
