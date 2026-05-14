import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { type CityMap, type Coordinates } from "@/lib/db.server";
import { BookOpen, MapPin, MessageCircle, Minus, Plus, UserRound } from "lucide-react";

type ActivePin = { type: "friend"; id: string } | { type: "guide"; id: string } | null;
type MapLayer = "friends" | "places";

export const Route = createFileRoute("/_app/map")({
  head: () => ({ meta: [{ title: "Nearby friends · LocalLens" }] }),
  loader: async () => await getLocalLensDataFn(),
  component: MapPage,
});

function MapPage() {
  const { cityMaps, currentUser, guidePlacePins, guides, nearbyByCity, usersById } =
    Route.useLoaderData();
  const [city, setCity] = useState(currentUser.city);
  const [zoom, setZoom] = useState(13);
  const [mapLayer, setMapLayer] = useState<MapLayer>("friends");
  const friends = nearbyByCity[city] ?? [];
  const map = cityMaps[city] ?? cityMaps[currentUser.city];
  const guidePins = guidePlacePins.filter((pin) => pin.city === city);
  const [activePin, setActivePin] = useState<ActivePin>(
    friends[0]
      ? { type: "friend", id: friends[0].id }
      : guidePins[0]
        ? { type: "guide", id: guidePins[0].id }
        : null,
  );

  const activeFriend =
    activePin?.type === "friend" ? friends.find((friend) => friend.id === activePin.id) : null;
  const activeGuidePin =
    activePin?.type === "guide" ? guidePins.find((pin) => pin.id === activePin.id) : null;
  const activeUser = activeFriend ? (usersById[activeFriend.id] ?? currentUser) : null;
  const activeGuide = activeGuidePin
    ? guides.find((guide) => guide.id === activeGuidePin.guideId)
    : null;
  const tiles = useMemo(() => getVisibleTiles(map.center, zoom), [map.center, zoom]);
  const visiblePinsCount = mapLayer === "friends" ? friends.length : guidePins.length;

  return (
    <>
      <PageHeader
        title="Nearby friends"
        subtitle="Live map view of friends nearby and the guide places they recommend."
        action={
          <select
            value={city}
            onChange={(e) => {
              const nextCity = e.target.value;
              const nextFriends = nearbyByCity[nextCity] ?? [];
              const nextGuidePins = guidePlacePins.filter((pin) => pin.city === nextCity);

              setCity(nextCity);
              setZoom(13);
              setMapLayer(nextFriends.length > 0 ? "friends" : "places");
              setActivePin(
                nextFriends[0]
                  ? { type: "friend", id: nextFriends[0].id }
                  : nextGuidePins[0]
                    ? { type: "guide", id: nextGuidePins[0].id }
                    : null,
              );
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.keys(cityMaps).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        }
      />

      <div className="px-6 md:px-10 py-8 grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6 max-w-7xl">
        <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="absolute inset-0 bg-[#d8e0d4]">
            {tiles.map((tile) => (
              <img
                key={`${tile.z}-${tile.x}-${tile.y}`}
                src={`https://tile.openstreetmap.org/${tile.z}/${tile.x}/${tile.y}.png`}
                alt=""
                className="absolute h-64 w-64 max-w-none select-none"
                draggable={false}
                style={{
                  left: `calc(50% + ${tile.left}px)`,
                  top: `calc(50% + ${tile.top}px)`,
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/20" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2 rounded-lg border border-border bg-card/95 p-2 text-xs shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={() => {
                setMapLayer("friends");
                setActivePin(friends[0] ? { type: "friend", id: friends[0].id } : null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 transition ${
                mapLayer === "friends"
                  ? "bg-teal text-teal-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <UserRound className="h-3.5 w-3.5" /> Friends
            </button>
            <button
              type="button"
              onClick={() => {
                setMapLayer("places");
                setActivePin(guidePins[0] ? { type: "guide", id: guidePins[0].id } : null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 transition ${
                mapLayer === "places"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Places
            </button>
          </div>

          <div className="absolute right-4 top-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <button
              type="button"
              onClick={() => setZoom((value) => clamp(value + 1, 11, 16))}
              className="grid h-9 w-9 place-items-center hover:bg-muted"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="h-px bg-border" />
            <button
              type="button"
              onClick={() => setZoom((value) => clamp(value - 1, 11, 16))}
              className="grid h-9 w-9 place-items-center hover:bg-muted"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {mapLayer === "friends" &&
            friends.map((friend) => {
              const user = usersById[friend.id] ?? currentUser;
              const position = toMapPosition(friend.coordinates, map, zoom);
              const isActive = activePin?.type === "friend" && activePin.id === friend.id;

              return (
                <button
                  key={friend.id}
                  onClick={() => setActivePin({ type: "friend", id: friend.id })}
                  className="absolute -translate-x-1/2 -translate-y-full group"
                  style={{
                    left: `calc(50% + ${position.x}px)`,
                    top: `calc(50% + ${position.y}px)`,
                  }}
                  aria-label={`${user.name} at ${friend.place}`}
                >
                  <span
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold shadow-lg transition ${
                      isActive
                        ? "bg-teal text-teal-foreground ring-4 ring-background scale-110"
                        : "bg-card text-foreground ring-2 ring-teal/70 group-hover:scale-105"
                    }`}
                  >
                    {user.avatar}
                    <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1 rotate-45 bg-inherit" />
                  </span>
                  <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] opacity-0 shadow-sm transition group-hover:opacity-100">
                    {user.name}
                  </span>
                </button>
              );
            })}

          {mapLayer === "places" &&
            guidePins.map((pin) => {
              const position = toMapPosition(pin.coordinates, map, zoom);
              const isActive = activePin?.type === "guide" && activePin.id === pin.id;

              return (
                <button
                  key={pin.id}
                  onClick={() => setActivePin({ type: "guide", id: pin.id })}
                  className="absolute -translate-x-1/2 -translate-y-full group"
                  style={{
                    left: `calc(50% + ${position.x}px)`,
                    top: `calc(50% + ${position.y}px)`,
                  }}
                  aria-label={`${pin.name} guide place`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition ${
                      isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-background scale-110"
                        : "bg-card text-primary ring-2 ring-primary/35 group-hover:scale-105"
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] opacity-0 shadow-sm transition group-hover:opacity-100">
                    {pin.name}
                  </span>
                </button>
              );
            })}

          {visiblePinsCount === 0 && (
            <div className="absolute inset-0 grid place-items-center bg-background/70 text-sm text-muted-foreground">
              No {mapLayer === "friends" ? "friends" : "guide places"} in {city} yet.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          {mapLayer === "friends" ? (
            <section className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Friends in {city}
              </h3>
              <div className="space-y-2">
                {friends.map((friend) => {
                  const user = usersById[friend.id] ?? currentUser;
                  const isActive = activePin?.type === "friend" && activePin.id === friend.id;

                  return (
                    <button
                      key={friend.id}
                      onClick={() => setActivePin({ type: "friend", id: friend.id })}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        isActive ? "border-teal bg-muted" : "border-border hover:bg-muted/70"
                      }`}
                    >
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {friend.place}
                      </p>
                    </button>
                  );
                })}
                {friends.length === 0 && (
                  <p className="text-sm text-muted-foreground">No friends here right now.</p>
                )}
              </div>
            </section>
          ) : (
            <section className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Guide places
              </h3>
              <div className="space-y-2">
                {guidePins.map((pin) => {
                  const guide = guides.find((g) => g.id === pin.guideId);
                  const isActive = activePin?.type === "guide" && activePin.id === pin.id;

                  return (
                    <button
                      key={pin.id}
                      onClick={() => setActivePin({ type: "guide", id: pin.id })}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        isActive ? "border-primary bg-muted" : "border-border hover:bg-muted/70"
                      }`}
                    >
                      <p className="text-sm font-medium">{pin.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{guide?.title}</p>
                    </button>
                  );
                })}
                {guidePins.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No guide places for this city yet.
                  </p>
                )}
              </div>
            </section>
          )}

          {(activeUser || activeGuidePin) && (
            <section className="rounded-xl border border-border bg-card p-4">
              {activeUser && activeFriend ? (
                <>
                  <p className="text-sm font-medium">{activeUser.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activeUser.bio}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
                    <MapPin className="h-4 w-4 text-teal" /> {activeFriend.place}
                  </p>
                  <Link
                    to="/chat/$friendId"
                    params={{ friendId: activeUser.id }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md gradient-ocean px-3 py-1.5 text-sm text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Ask about this place
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">{activeGuidePin?.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activeGuide?.title}</p>
                  {activeGuide && (
                    <Link
                      to="/guides/$guideId"
                      params={{ guideId: activeGuide.id }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                      <BookOpen className="h-3.5 w-3.5" /> Open guide
                    </Link>
                  )}
                </>
              )}
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function getVisibleTiles(center: Coordinates, zoom: number) {
  const centerPoint = latLngToWorldPixel(center, zoom);
  const centerTileX = Math.floor(centerPoint.x / tileSize);
  const centerTileY = Math.floor(centerPoint.y / tileSize);
  const tiles: { x: number; y: number; z: number; left: number; top: number }[] = [];
  const tileCount = 2 ** zoom;

  for (let x = centerTileX - 3; x <= centerTileX + 3; x += 1) {
    for (let y = centerTileY - 3; y <= centerTileY + 3; y += 1) {
      if (y < 0 || y >= tileCount) continue;

      const wrappedX = ((x % tileCount) + tileCount) % tileCount;

      tiles.push({
        x: wrappedX,
        y,
        z: zoom,
        left: x * tileSize - centerPoint.x,
        top: y * tileSize - centerPoint.y,
      });
    }
  }

  return tiles;
}

function toMapPosition(coordinates: Coordinates, map: CityMap, zoom: number) {
  const point = latLngToWorldPixel(coordinates, zoom);
  const centerPoint = latLngToWorldPixel(map.center, zoom);

  return {
    x: point.x - centerPoint.x,
    y: point.y - centerPoint.y,
  };
}

const tileSize = 256;

function latLngToWorldPixel(coordinates: Coordinates, zoom: number) {
  const sinLat = Math.sin((coordinates.lat * Math.PI) / 180);
  const scale = tileSize * 2 ** zoom;

  return {
    x: ((coordinates.lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
