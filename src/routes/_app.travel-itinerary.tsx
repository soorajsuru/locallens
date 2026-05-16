import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Avatar, PageHeader } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { type CityTopPlace, type Coordinates } from "@/lib/db.server";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Clock,
  MapPin,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";

type PlannerPlace = {
  name: string;
  description: string;
  coordinates: Coordinates;
  source: "top" | "guide" | "both";
  rank?: number;
};

export const Route = createFileRoute("/_app/travel-itinerary")({
  head: () => ({ meta: [{ title: "Travel Itinerary · LocalLens" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : undefined,
    guideId: typeof search.guideId === "string" ? search.guideId : undefined,
  }),
  loader: async () => await getLocalLensDataFn(),
  component: TravelItinerary,
});

function TravelItinerary() {
  const { city: searchCity, guideId } = Route.useSearch();
  const { cities, guides, guidePlacePins, topPlacesByCity, usersById, cityMaps, currentUser } =
    Route.useLoaderData();
  const city = searchCity && cities.includes(searchCity) ? searchCity : "";
  const guide = guides.find((candidate) => candidate.id === guideId && candidate.city === city);
  const guideAuthor = guide ? (usersById[guide.authorId] ?? currentUser) : currentUser;
  const topPlaces = useMemo(
    () => (city ? (topPlacesByCity[city] ?? []) : []),
    [city, topPlacesByCity],
  );
  const guidePlaces = useMemo(
    () =>
      guide
        ? guidePlacePins.filter((place) => place.guideId === guide.id && place.city === city)
        : [],
    [city, guide, guidePlacePins],
  );
  const [selectedPlaceNames, setSelectedPlaceNames] = useState<string[]>([]);
  const [arrivalTime, setArrivalTime] = useState("");
  const [placesPerDay, setPlacesPerDay] = useState(3);

  const allPlaces = useMemo(
    () => buildPlannerPlaces(topPlaces, guidePlaces, cityMaps[city]?.center),
    [city, cityMaps, guidePlaces, topPlaces],
  );
  const orderedItinerary = useMemo(() => {
    const selected = selectedPlaceNames
      .map((name) => allPlaces.find((place) => place.name === name))
      .filter((place): place is PlannerPlace => Boolean(place));

    return optimizeRoute(selected);
  }, [allPlaces, selectedPlaceNames]);
  const itineraryDays = useMemo(
    () => chunkPlaces(orderedItinerary, placesPerDay),
    [orderedItinerary, placesPerDay],
  );
  const canCreatePlan = selectedPlaceNames.length > 0 && arrivalTime.length > 0;

  function togglePlace(name: string) {
    setSelectedPlaceNames((current) =>
      current.includes(name) ? current.filter((place) => place !== name) : [...current, name],
    );
  }

  if (!city || !guide) {
    return (
      <>
        <PageHeader
          title="Travel Itinerary"
          subtitle="Search a city and choose a guide before building your trip plan."
        />
        <div className="px-6 md:px-10 py-8 max-w-3xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Back to city search
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Travel Itinerary"
        subtitle={`Plan ${city} with ${guideAuthor.name}'s recommendations beside the city top ten.`}
        action={
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Change guide
          </Link>
        }
      />

      <div className="px-6 md:px-10 py-8 max-w-7xl space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar initials={guideAuthor.avatar} size={44} />
              <div>
                <p className="text-xs uppercase tracking-wider text-teal">Selected guide</p>
                <h2 className="text-xl font-display text-primary">{guide.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {guideAuthor.name} · {guide.bestTimings}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              {selectedPlaceNames.length} selected
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <PlaceList
            title={`Top 10 places in ${city}`}
            subtitle="The city-wide must-see list."
            places={topPlaces.map((place) => ({
              name: place.name,
              detail: place.description,
              badge: `#${place.rank}`,
            }))}
            selectedPlaceNames={selectedPlaceNames}
            onToggle={togglePlace}
          />
          <PlaceList
            title={`${guideAuthor.name}'s recommended places`}
            subtitle="Six picks from this local guide."
            places={guidePlaces.map((place) => {
              const topPlace = topPlaces.find(
                (candidate) => candidate.name.toLowerCase() === place.name.toLowerCase(),
              );

              return {
                name: place.name,
                detail: topPlace?.description ?? "Guide recommended place.",
                badge: topPlace ? `Top #${topPlace.rank}` : "Guide",
              };
            })}
            selectedPlaceNames={selectedPlaceNames}
            onToggle={togglePlace}
          />
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-teal">Trip details</p>
              <h2 className="mt-1 text-2xl font-display text-primary">Fine tune the day plan</h2>
            </div>
            <Sparkles className="h-5 w-5 text-teal" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_240px]">
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CalendarClock className="h-4 w-4" /> When exactly will you arrive in {city}?
              </span>
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(event) => setArrivalTime(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" /> Places per day
              </span>
              <select
                value={placesPerDay}
                onChange={(event) => setPlacesPerDay(Number(event.target.value))}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
              >
                {[1, 2, 3].map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "place" : "places"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-teal">Optimized route</p>
              <h2 className="mt-1 text-2xl font-display text-primary">Best itinerary</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Places are ordered by nearest-neighbor distance to reduce backtracking.
              </p>
            </div>
            <RouteIcon className="h-6 w-6 text-teal" />
          </div>

          {canCreatePlan ? (
            <div className="mt-5 space-y-4">
              {itineraryDays.map((dayPlaces, dayIndex) => (
                <article
                  key={dayIndex}
                  className="overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
                    <div>
                      <h3 className="text-lg font-display text-primary">Day {dayIndex + 1}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDayLabel(arrivalTime, dayIndex)} · {dayPlaces.length} stops
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1 text-xs text-teal">
                      <Clock className="h-3.5 w-3.5" />
                      Start {formatStartTime(arrivalTime, dayIndex)}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {dayPlaces.map((place, placeIndex) => (
                        <div key={place.name} className="grid grid-cols-[36px_1fr] gap-3">
                          <div className="flex flex-col items-center">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-teal text-xs font-semibold text-white">
                              {placeIndex + 1}
                            </span>
                            {placeIndex < dayPlaces.length - 1 && (
                              <span className="mt-2 h-full min-h-8 w-px bg-border" />
                            )}
                          </div>
                          <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-foreground">{place.name}</p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {place.description}
                                </p>
                              </div>
                              <SourceBadge source={place.source} rank={place.rank} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Select places from the two lists, add your exact arrival time, and choose up to 3
              places per day to generate the itinerary.
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function PlaceList({
  title,
  subtitle,
  places,
  selectedPlaceNames,
  onToggle,
}: {
  title: string;
  subtitle: string;
  places: { name: string; detail: string; badge: string }[];
  selectedPlaceNames: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div>
        <h2 className="text-xl font-display text-primary">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mt-4 space-y-2">
        {places.map((place) => {
          const selected = selectedPlaceNames.includes(place.name);

          return (
            <button
              key={place.name}
              type="button"
              onClick={() => onToggle(place.name)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                selected
                  ? "border-teal bg-teal/10"
                  : "border-border bg-surface hover:border-teal/50"
              }`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${
                  selected ? "border-teal bg-teal text-white" : "border-input bg-background"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{place.name}</span>
                  <span className="rounded-full bg-card px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {place.badge}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {place.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SourceBadge({ source, rank }: { source: PlannerPlace["source"]; rank?: number }) {
  const label = source === "both" ? "Top + guide" : source === "guide" ? "Guide pick" : "Top place";

  return (
    <span className="shrink-0 rounded-full bg-teal/10 px-2 py-1 text-[10px] uppercase tracking-wide text-teal">
      {rank ? `${label} #${rank}` : label}
    </span>
  );
}

function buildPlannerPlaces(
  topPlaces: CityTopPlace[],
  guidePlaces: { name: string; coordinates: Coordinates }[],
  cityCenter?: Coordinates,
) {
  const coordinateByName = new Map<string, Coordinates>();
  guidePlaces.forEach((place) => coordinateByName.set(place.name.toLowerCase(), place.coordinates));
  const places = new Map<string, PlannerPlace>();

  topPlaces.forEach((place, index) => {
    places.set(place.name.toLowerCase(), {
      name: place.name,
      description: place.description,
      coordinates:
        coordinateByName.get(place.name.toLowerCase()) ??
        fallbackCoordinates(cityCenter, index, topPlaces.length),
      source: "top",
      rank: place.rank,
    });
  });

  guidePlaces.forEach((place, index) => {
    const key = place.name.toLowerCase();
    const existing = places.get(key);
    places.set(key, {
      name: existing?.name ?? place.name,
      description: existing?.description ?? "A local guide recommendation worth adding.",
      coordinates: place.coordinates ?? fallbackCoordinates(cityCenter, index, guidePlaces.length),
      source: existing ? "both" : "guide",
      rank: existing?.rank,
    });
  });

  return Array.from(places.values());
}

function optimizeRoute(places: PlannerPlace[]) {
  if (places.length <= 2) return places;
  const remaining = [...places].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  const route = [remaining.shift() as PlannerPlace];

  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let nextIndex = 0;
    let nextDistance = Number.POSITIVE_INFINITY;

    remaining.forEach((place, index) => {
      const distance = getDistanceKm(current.coordinates, place.coordinates);
      if (distance < nextDistance) {
        nextDistance = distance;
        nextIndex = index;
      }
    });

    route.push(remaining.splice(nextIndex, 1)[0]);
  }

  return route;
}

function chunkPlaces(places: PlannerPlace[], size: number) {
  return places.reduce<PlannerPlace[][]>((days, place, index) => {
    const dayIndex = Math.floor(index / size);
    days[dayIndex] ??= [];
    days[dayIndex].push(place);
    return days;
  }, []);
}

function getDistanceKm(a: Coordinates, b: Coordinates) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function fallbackCoordinates(cityCenter: Coordinates | undefined, index: number, total: number) {
  const center = cityCenter ?? { lat: 20.5937, lng: 78.9629 };
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;

  return {
    lat: center.lat + Math.sin(angle) * 0.015,
    lng: center.lng + Math.cos(angle) * 0.015,
  };
}

function formatDayLabel(arrivalTime: string, offset: number) {
  const date = new Date(arrivalTime);
  date.setDate(date.getDate() + offset);

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatStartTime(arrivalTime: string, offset: number) {
  const date = new Date(arrivalTime);
  if (offset > 0) {
    date.setDate(date.getDate() + offset);
    date.setHours(9, 0, 0, 0);
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
