import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, MapPin } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { getStoredSelectedCity } from "@/lib/placeSelection";

export const Route = createFileRoute("/_app/storybook")({
  head: () => ({ meta: [{ title: "City storybook · LocalLens" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : undefined,
  }),
  loader: async () => await getLocalLensDataFn(),
  component: StorybookPage,
});

function StorybookPage() {
  const { cities, topPlacesByCity } = Route.useLoaderData();
  const search = Route.useSearch();
  const storedCity = getStoredSelectedCity();
  const city =
    search.city && cities.includes(search.city)
      ? search.city
      : storedCity && cities.includes(storedCity)
        ? storedCity
        : "";
  const places = city ? (topPlacesByCity[city] ?? []) : [];

  return (
    <>
      <PageHeader
        title={city ? `${city} Storybook` : "City Storybook"}
        subtitle="The ten places worth building your first day around."
        action={
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Back to search
          </Link>
        }
      />

      <div className="px-6 md:px-10 py-8 max-w-7xl">
        {places.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <article
                key={place.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-teal/50 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    referrerPolicy="no-referrer"
                    loading={place.rank <= 6 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.src = getCityFallbackImage(city);
                    }}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 text-sm font-semibold text-primary shadow-sm">
                    {place.rank}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {city}
                  </div>
                  <h2 className="text-xl font-display leading-tight text-primary">{place.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {place.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[420px] place-items-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
            <div>
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-display text-primary">Search a city first</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Go back to the Feed search, choose a city, and the Storybook will show its top ten
                places.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function getCityFallbackImage(city: string) {
  const fallbackByCity: Record<string, string> = {
    Jaipur: "https://commons.wikimedia.org/wiki/Special:FilePath/Hawa_Mahal._Jaipur.jpg",
    Bengaluru: "https://commons.wikimedia.org/wiki/Special:FilePath/Bangalore_Palace_2014.jpg",
    Mumbai: "https://commons.wikimedia.org/wiki/Special:FilePath/Gateway_of_India_Mumbai_03-2016.jpg",
    Delhi: "https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg",
    Goa: "https://commons.wikimedia.org/wiki/Special:FilePath/Goa_beach.jpg",
    Varanasi: "https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi_Ghats.jpg",
    Kochi: "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese_fishing_nets,_Kochi.jpg",
  };

  return fallbackByCity[city] ?? "https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg";
}
