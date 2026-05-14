// Mock data for LocalLens (UI scaffold — wire to backend later)

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

export const currentUser: User = {
  id: "u_me",
  name: "You",
  city: "Jaipur",
  bio: "Traveling slow across India. Chai, forts, and conversations.",
  avatar: "YO",
};

export const users: User[] = [
  currentUser,
  {
    id: "u1",
    name: "Aarav Sharma",
    city: "Jaipur",
    bio: "Born in the Pink City. Knows every kachori worth queuing for.",
    avatar: "AS",
    online: true,
  },
  {
    id: "u2",
    name: "Priya Iyer",
    city: "Jaipur",
    bio: "Block-print designer in Bagru. Loves dawn at Nahargarh.",
    avatar: "PI",
    online: true,
  },
  {
    id: "u3",
    name: "Karthik Menon",
    city: "Bengaluru",
    bio: "Coffee snob. Knows every filter kaapi spot in VV Puram.",
    avatar: "KM",
  },
  {
    id: "u4",
    name: "Meera Nair",
    city: "Jaipur",
    bio: "Architect. Tile and jharokha spotter.",
    avatar: "MN",
  },
  {
    id: "u5",
    name: "Rohan Kapoor",
    city: "Mumbai",
    bio: "Street food cartographer from Bandra to Mohammed Ali Road.",
    avatar: "RK",
    online: true,
  },
  {
    id: "u6",
    name: "Ananya Das",
    city: "Jaipur",
    bio: "Bazaar-hopper. Bapu Bazaar to Johari, blindfolded.",
    avatar: "AD",
  },
  {
    id: "u7",
    name: "Ishaan Verma",
    city: "Delhi",
    bio: "Old Delhi food walks. Karim's at midnight.",
    avatar: "IV",
  },
];

export const friendIds = ["u1", "u2", "u4", "u6", "u3", "u5", "u7"];

export const guides: Guide[] = [
  {
    id: "g1",
    authorId: "u1",
    city: "Jaipur",
    title: "Aarav's Jaipur — beyond the tourist circuit",
    mustVisit: [
      // "Nahargarh Fort at sunrise (not sunset — fewer people)",
      // "Rawat Mishthan Bhandar for pyaaz kachori, before 10am",
      "Patrika Gate at golden hour, but enter from Jawahar Circle side",
    ],
    hiddenSpots: [
      "Panna Meena ka Kund stepwell — quiet at 8am",
      "Anokhi Museum of Hand Printing in Amer",
      "Tapri Central rooftop at C-Scheme for monsoon chai",
    ],
    bestTimings:
      "October to March. Avoid May–June (45°C+). Monsoon (July–Sept) is dramatic but humid.",
    dos: [
      "Bargain in Bapu Bazaar — start at 40% of quoted price",
      "Carry small change for autos and tea stalls",
      "Cover shoulders when entering temples and forts",
    ],
    donts: [
      "Don't book elephant rides at Amer — walk up instead",
      "Don't accept 'free' city tours from hotel touts",
      "Don't trust the first gem dealer in Johari Bazaar",
    ],
    tips: [
      "Composite ticket (₹400) covers Amer, Nahargarh, Jantar Mantar, Hawa Mahal — buy at Amer first",
      "Use the Jaipur Metro for Chandpole to Mansarovar — beats traffic",
    ],
    updatedAt: "2 days ago",
  },
  {
    id: "g2",
    authorId: "u2",
    city: "Jaipur",
    title: "Priya's craft trail — Bagru to Sanganer",
    mustVisit: [
      "Bagru village block-print workshops (book ahead)",
      "Sanganer paper-making units near the airport",
      "Anokhi flagship at C-Scheme to see finished work",
    ],
    hiddenSpots: [
      "Studio Bagru — Vijendra ji's family workshop",
      "Jaipur Rugs flagship in Malviya Nagar",
    ],
    bestTimings: "November to February. Workshops are closed on Sundays.",
    dos: ["Ask before photographing artisans", "Buy directly from karigars, not middlemen shops"],
    donts: [
      "Don't haggle aggressively at workshops — these are fair prices",
      "Don't believe '100% natural dye' tags without asking",
    ],
    tips: ["Hire a Hindi-speaking driver for Bagru — most karigars don't speak English"],
    updatedAt: "5 hours ago",
  },
  {
    id: "g3",
    authorId: "u3",
    city: "Bengaluru",
    title: "Karthik's filter-kaapi crawl",
    mustVisit: [
      "Vidyarthi Bhavan in Basavanagudi for masala dosa (cash only)",
      "CTR (Central Tiffin Room) in Malleshwaram for benne masala dosa",
      "Brahmin's Coffee Bar — chutney recipe is a state secret",
    ],
    hiddenSpots: [
      "Veena Stores in Malleshwaram for idli at 7am",
      "Airlines Hotel — drive-in for late-night dosa",
    ],
    bestTimings: "November to February. Avoid Outer Ring Road during weekday peak (8–11am, 6–9pm).",
    dos: [
      "Order 'by-two coffee' to share — that's a Bangalore thing",
      "Use Namma Metro to skip traffic",
    ],
    donts: [
      "Don't drive yourself — Ola/Uber or auto is faster",
      "Don't expect anything to open before 7am except darshinis",
    ],
    tips: ["Cubbon Park is closed to vehicles on Sundays — best time to walk it"],
    updatedAt: "1 week ago",
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    authorId: "u2",
    city: "Jaipur",
    area: "Nahargarh Fort",
    body: "Sunset right now is unreal — pink sky over the whole city. Skip Hawa Mahal, come here.",
    tag: "tip",
    createdAt: "12 min ago",
  },
  {
    id: "p2",
    authorId: "u1",
    city: "Jaipur",
    area: "Hawa Mahal",
    body: "Pickpockets active near Hawa Mahal entrance — keep phones zipped. Tourist police on duty though.",
    tag: "warning",
    createdAt: "38 min ago",
  },
  {
    id: "p3",
    authorId: "u4",
    city: "Jaipur",
    area: "Amer",
    body: "Amer Fort light & sound show cancelled tonight due to rain. Refunds at counter.",
    tag: "event",
    createdAt: "1 hr ago",
  },
  {
    id: "p4",
    authorId: "u6",
    city: "Jaipur",
    area: "C-Scheme",
    body: "Sudden pre-monsoon shower in C-Scheme. Tapri Central rooftop is the move.",
    tag: "weather",
    createdAt: "2 hr ago",
  },
  {
    id: "p5",
    authorId: "u1",
    city: "Jaipur",
    area: "JLN Marg",
    body: "Wedding procession blocking JLN Marg near World Trade Park till ~9pm. Take Tonk Road instead.",
    tag: "traffic",
    createdAt: "3 hr ago",
  },
  {
    id: "p6",
    authorId: "u5",
    city: "Mumbai",
    area: "Mohammed Ali Road",
    body: "Ramzan-style late-night kebabs at Bademiya — short queue right now.",
    tag: "tip",
    createdAt: "4 hr ago",
  },
  {
    id: "p7",
    authorId: "u7",
    city: "Delhi",
    area: "Chandni Chowk",
    body: "Metro Yellow Line delays — Chawri Bazaar to Kashmere Gate running 15min late.",
    tag: "traffic",
    createdAt: "20 min ago",
  },
];

export const conversations: Conversation[] = [
  {
    friendId: "u1",
    lastMessage: "Try LMB on MI Road, ground floor only — upstairs is overpriced 🙌",
    at: "9:41",
    unread: 2,
  },
  {
    friendId: "u2",
    lastMessage: "Workshop visit at 11am tomorrow if you're free",
    at: "Yesterday",
  },
  { friendId: "u4", lastMessage: "Sent you the haveli walking route", at: "Mon" },
  { friendId: "u6", lastMessage: "Bapu Bazaar at 7pm. Meet at the gate?", at: "Sun" },
];

export const messagesByFriend: Record<string, Message[]> = {
  u1: [
    {
      id: "m1",
      fromId: "u1",
      toId: "u_me",
      body: "Hey! Saw you're in Jaipur — staying long?",
      at: "9:30",
    },
    {
      id: "m2",
      fromId: "u_me",
      toId: "u1",
      body: "Just five days. Where should I get dinner tonight?",
      at: "9:32",
    },
    {
      id: "m3",
      fromId: "u1",
      toId: "u_me",
      body: "Skip Chokhi Dhani if it's just one night — too touristy. Try LMB on MI Road for proper Rajasthani thali.",
      at: "9:40",
      contextPlace: "Laxmi Misthan Bhandar (LMB)",
    },
    {
      id: "m4",
      fromId: "u1",
      toId: "u_me",
      body: "Try LMB on MI Road, ground floor only — upstairs is overpriced 🙌",
      at: "9:41",
    },
  ],
  u2: [
    {
      id: "m5",
      fromId: "u2",
      toId: "u_me",
      body: "Workshop visit at 11am tomorrow if you're free",
      at: "Yesterday",
    },
  ],
  u4: [
    { id: "m6", fromId: "u4", toId: "u_me", body: "Sent you the haveli walking route", at: "Mon" },
  ],
  u6: [
    {
      id: "m7",
      fromId: "u6",
      toId: "u_me",
      body: "Bapu Bazaar at 7pm. Meet at the gate?",
      at: "Sun",
    },
  ],
};

export const cities = ["Jaipur", "Bengaluru", "Mumbai", "Delhi", "Goa", "Varanasi", "Kochi"];

export function getUser(id: string): User {
  return users.find((u) => u.id === id) ?? currentUser;
}

export type Coordinates = { lat: number; lng: number };
export type NearbyFriend = { id: string; place: string; coordinates: Coordinates };
export const nearbyByCity: Record<string, NearbyFriend[]> = {
  Jaipur: [
    { id: "u1", place: "Hawa Mahal", coordinates: { lat: 26.9239, lng: 75.8267 } },
    { id: "u2", place: "Nahargarh Fort", coordinates: { lat: 26.9368, lng: 75.8155 } },
    { id: "u4", place: "Amer Fort", coordinates: { lat: 26.9855, lng: 75.8513 } },
    { id: "u6", place: "Bapu Bazaar", coordinates: { lat: 26.9164, lng: 75.8198 } },
  ],
  Bengaluru: [{ id: "u3", place: "Malleshwaram", coordinates: { lat: 13.0031, lng: 77.5643 } }],
  Mumbai: [{ id: "u5", place: "Bandra", coordinates: { lat: 19.0596, lng: 72.8295 } }],
  Delhi: [{ id: "u7", place: "Chandni Chowk", coordinates: { lat: 28.6506, lng: 77.2303 } }],
};

export type CityMap = {
  center: Coordinates;
  bbox: [west: number, south: number, east: number, north: number];
};

export const cityMaps: Record<string, CityMap> = {
  Jaipur: { center: { lat: 26.9124, lng: 75.7873 }, bbox: [75.7309, 26.8757, 75.8892, 27.0098] },
  Bengaluru: { center: { lat: 12.9716, lng: 77.5946 }, bbox: [77.517, 12.914, 77.662, 13.047] },
  Mumbai: { center: { lat: 19.076, lng: 72.8777 }, bbox: [72.78, 18.955, 72.94, 19.17] },
  Delhi: { center: { lat: 28.6139, lng: 77.209 }, bbox: [77.155, 28.585, 77.263, 28.681] },
  Goa: { center: { lat: 15.4909, lng: 73.8278 }, bbox: [73.7, 15.38, 73.95, 15.58] },
  Varanasi: { center: { lat: 25.3176, lng: 82.9739 }, bbox: [82.91, 25.25, 83.04, 25.36] },
  Kochi: { center: { lat: 9.9312, lng: 76.2673 }, bbox: [76.21, 9.89, 76.34, 10] },
};

export type GuidePlacePin = {
  id: string;
  guideId: string;
  name: string;
  city: string;
  coordinates: Coordinates;
};

export const guidePlacePins: GuidePlacePin[] = [
  {
    id: "gp1",
    guideId: "g1",
    name: "Nahargarh Fort",
    city: "Jaipur",
    coordinates: { lat: 26.9368, lng: 75.8155 },
  },
  {
    id: "gp2",
    guideId: "g1",
    name: "Rawat Mishthan Bhandar",
    city: "Jaipur",
    coordinates: { lat: 26.9191, lng: 75.7943 },
  },
  {
    id: "gp3",
    guideId: "g1",
    name: "Patrika Gate",
    city: "Jaipur",
    coordinates: { lat: 26.8412, lng: 75.8001 },
  },
  {
    id: "gp4",
    guideId: "g2",
    name: "Bagru block-print workshops",
    city: "Jaipur",
    coordinates: { lat: 26.8093, lng: 75.5423 },
  },
  {
    id: "gp5",
    guideId: "g2",
    name: "Sanganer paper-making units",
    city: "Jaipur",
    coordinates: { lat: 26.8227, lng: 75.7893 },
  },
  {
    id: "gp6",
    guideId: "g3",
    name: "Vidyarthi Bhavan",
    city: "Bengaluru",
    coordinates: { lat: 12.945, lng: 77.5714 },
  },
  {
    id: "gp7",
    guideId: "g3",
    name: "CTR",
    city: "Bengaluru",
    coordinates: { lat: 12.9982, lng: 77.5697 },
  },
  {
    id: "gp8",
    guideId: "g3",
    name: "Brahmin's Coffee Bar",
    city: "Bengaluru",
    coordinates: { lat: 12.9556, lng: 77.5683 },
  },
];
