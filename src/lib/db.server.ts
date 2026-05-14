import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
export type User = {
  id: string;
  name: string;
  city: string;
  bio: string;
  avatar: string;
  online?: boolean;
};

export type Guide = {
  id: string;
  authorId: string;
  city: string;
  title: string;
  mustVisit: string[];
  hiddenSpots: string[];
  bestTimings: string;
  dos: string[];
  donts: string[];
  tips: string[];
  updatedAt: string;
};

export type Post = {
  id: string;
  authorId: string;
  city: string;
  area: string;
  body: string;
  tag: "traffic" | "weather" | "tip" | "event" | "warning";
  createdAt: string;
};

export type Message = {
  id: string;
  fromId: string;
  toId: string;
  body: string;
  at: string;
  contextPlace?: string;
};

export type Conversation = {
  friendId: string;
  lastMessage: string;
  at: string;
  unread?: number;
};

export type Coordinates = { lat: number; lng: number };
export type NearbyFriend = { id: string; place: string; coordinates: Coordinates };

export type CityMap = {
  center: Coordinates;
  bbox: [west: number, south: number, east: number, north: number];
};

export type GuidePlacePin = {
  id: string;
  guideId: string;
  name: string;
  city: string;
  coordinates: Coordinates;
};

export type CityTopPlace = {
  id: string;
  city: string;
  rank: number;
  name: string;
  description: string;
  imageUrl: string;
};

const dbPath = join(process.cwd(), "data", "locallens.sqlite");

type DbUser = Omit<User, "online"> & {
  online: number;
  is_current: number;
};

type DbGuide = {
  id: string;
  authorId: string;
  city: string;
  title: string;
  mustVisitJson: string;
  hiddenSpotsJson: string;
  bestTimings: string;
  dosJson: string;
  dontsJson: string;
  tipsJson: string;
  updatedAt: string;
};

type DbCityMap = {
  city: string;
  centerLat: number;
  centerLng: number;
  west: number;
  south: number;
  east: number;
  north: number;
};

type DbLiveLocation = {
  userId: string;
  city: string;
  place: string;
  lat: number;
  lng: number;
};

type DbGuidePlace = {
  id: string;
  guideId: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
};

type DbCityTopPlace = Omit<CityTopPlace, "imageUrl"> & {
  imageUrl: string;
};

type DbConversation = Conversation & {
  unread: number | null;
};

type DbMessage = Omit<Message, "contextPlace"> & {
  contextPlace: string | null;
};

export type LocalLensData = {
  currentUser: User;
  users: User[];
  friendIds: string[];
  guides: Guide[];
  posts: Post[];
  conversations: Conversation[];
  messagesByFriend: Record<string, Message[]>;
  cities: string[];
  nearbyByCity: Record<string, NearbyFriend[]>;
  cityMaps: Record<string, CityMap>;
  guidePlacePins: GuidePlacePin[];
  topPlacesByCity: Record<string, CityTopPlace[]>;
  usersById: Record<string, User>;
};

export function getLocalLensData(): LocalLensData {
  assertDatabaseExists();

  const users = query<DbUser>(`
    SELECT
      id,
      name,
      city,
      bio,
      avatar,
      online,
      is_current
    FROM users
    ORDER BY is_current DESC, id
  `).map(toUser);
  const currentUser = users.find((user) => user.id === "u_me") ?? users[0];

  if (!currentUser) {
    throw new Error("No current user found in local database.");
  }

  const friendIds = query<{ friendId: string }>(`
    SELECT friend_id AS friendId
    FROM friendships
    WHERE user_id = '${escapeSql(currentUser.id)}'
    ORDER BY created_at, friend_id
  `).map((row) => row.friendId);

  const guides = query<DbGuide>(`
    SELECT
      id,
      author_id AS authorId,
      city,
      title,
      must_visit_json AS mustVisitJson,
      hidden_spots_json AS hiddenSpotsJson,
      best_timings AS bestTimings,
      dos_json AS dosJson,
      donts_json AS dontsJson,
      tips_json AS tipsJson,
      updated_at AS updatedAt
    FROM guides
    ORDER BY id
  `).map(toGuide);

  const posts = query<Post>(`
    SELECT
      id,
      author_id AS authorId,
      city,
      area,
      body,
      tag,
      created_at AS createdAt
    FROM posts
    ORDER BY id
  `);

  const conversations = query<DbConversation>(`
    SELECT
      friend_id AS friendId,
      last_message AS lastMessage,
      last_message_at AS at,
      unread_count AS unread
    FROM conversations
    WHERE user_id = '${escapeSql(currentUser.id)}'
    ORDER BY id
  `).map((conversation) => ({
    friendId: conversation.friendId,
    lastMessage: conversation.lastMessage,
    at: conversation.at,
    unread: conversation.unread || undefined,
  }));

  const messages = query<DbMessage>(`
    SELECT
      id,
      from_id AS fromId,
      to_id AS toId,
      body,
      sent_at AS at,
      context_place AS contextPlace
    FROM messages
    ORDER BY id
  `);

  const cityMaps = Object.fromEntries(
    query<DbCityMap>(`
      SELECT
        city,
        center_lat AS centerLat,
        center_lng AS centerLng,
        west,
        south,
        east,
        north
      FROM city_maps
      ORDER BY city
    `).map((row) => [
      row.city,
      {
        center: { lat: row.centerLat, lng: row.centerLng },
        bbox: [row.west, row.south, row.east, row.north],
      },
    ]),
  ) as Record<string, CityMap>;

  const nearbyByCity = query<DbLiveLocation>(`
    SELECT
      user_id AS userId,
      city,
      place,
      lat,
      lng
    FROM live_locations
    ORDER BY city, user_id
  `).reduce<Record<string, NearbyFriend[]>>((acc, location) => {
    acc[location.city] ??= [];
    acc[location.city].push({
      id: location.userId,
      place: location.place,
      coordinates: { lat: location.lat, lng: location.lng },
    });

    return acc;
  }, {});

  const guidePlacePins = query<DbGuidePlace>(`
    SELECT
      id,
      guide_id AS guideId,
      name,
      city,
      lat,
      lng
    FROM guide_places
    ORDER BY city, id
  `).map((place) => ({
    id: place.id,
    guideId: place.guideId,
    name: place.name,
    city: place.city,
    coordinates: { lat: place.lat, lng: place.lng },
  }));

  const topPlacesByCity = query<DbCityTopPlace>(`
    SELECT
      id,
      city,
      rank,
      name,
      description,
      image_url AS imageUrl
    FROM city_top_places
    ORDER BY city, rank
  `).reduce<Record<string, CityTopPlace[]>>((acc, place) => {
    acc[place.city] ??= [];
    acc[place.city].push(place);

    return acc;
  }, {});

  return {
    currentUser,
    users,
    friendIds,
    guides,
    posts,
    conversations,
    messagesByFriend: groupMessagesByFriend(messages, currentUser.id),
    cities: Object.keys(cityMaps),
    nearbyByCity,
    cityMaps,
    guidePlacePins,
    topPlacesByCity,
    usersById: Object.fromEntries(users.map((user) => [user.id, user])),
  };
}

function query<T>(sql: string): T[] {
  const output = execFileSync("sqlite3", ["-json", dbPath, sql], {
    encoding: "utf8",
  }).trim();

  if (!output) return [];

  return JSON.parse(output) as T[];
}

function toUser(user: DbUser): User {
  return {
    id: user.id,
    name: user.name,
    city: user.city,
    bio: user.bio,
    avatar: user.avatar,
    online: Boolean(user.online),
  };
}

function toGuide(guide: DbGuide): Guide {
  return {
    id: guide.id,
    authorId: guide.authorId,
    city: guide.city,
    title: guide.title,
    mustVisit: JSON.parse(guide.mustVisitJson) as string[],
    hiddenSpots: JSON.parse(guide.hiddenSpotsJson) as string[],
    bestTimings: guide.bestTimings,
    dos: JSON.parse(guide.dosJson) as string[],
    donts: JSON.parse(guide.dontsJson) as string[],
    tips: JSON.parse(guide.tipsJson) as string[],
    updatedAt: guide.updatedAt,
  };
}

function groupMessagesByFriend(messages: DbMessage[], currentUserId: string) {
  return messages.reduce<Record<string, Message[]>>((acc, message) => {
    const friendId = message.fromId === currentUserId ? message.toId : message.fromId;
    acc[friendId] ??= [];
    acc[friendId].push({
      id: message.id,
      fromId: message.fromId,
      toId: message.toId,
      body: message.body,
      at: message.at,
      contextPlace: message.contextPlace ?? undefined,
    });

    return acc;
  }, {});
}

function assertDatabaseExists() {
  if (existsSync(dbPath)) return;

  throw new Error(`Local database not found at ${dbPath}. Run npm run db:init first.`);
}

function escapeSql(value: string) {
  return value.replaceAll("'", "''");
}
