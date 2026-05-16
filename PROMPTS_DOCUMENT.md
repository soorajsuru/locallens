# Prompt Samples Used During Development

These are some of the prompts I used or modified while developing my project **LocalLens**. First I used Lovable for creating the basic scaffold of the project, then I used VS Code ChatGPT and Codex for improving modules, fixing bugs, adding database logic and making the UI better.

## 1. Initial Project Scaffold

```text
Create a web app called LocalLens for travellers. It should help users find local friends, city guides, live updates and nearby places. Make it modern and responsive using React. Add pages like login, dashboard, map, friends, chat and guides. UI should look clean and little travel based.
```

## 2. App Layout and Navigation

```text
Make a proper app layout for LocalLens with sidebar navigation. Add links for Dashboard, Map, Guides, Friends, Chat, Storybook and Profile. Keep design simple but nice, and make it work in mobile also.
```

## 3. Dashboard Module

```text
I want dashboard page where user can search city like Bengaluru, Mumbai, Delhi etc. After selecting city show live local feed, nearby friends, city guides and people suggestions. Also add post box so user can add local update with tags like traffic, weather, tip and warning.
```

## 4. City Search and Selected Place

```text
Add city search in dashboard and store selected city so same city can be used in other pages also. If user search bangalore or mumbai then show related data only. pls make it not break if city is empty.
```

## 5. Map Module

```text
Create map page for LocalLens. It should show nearby friends on map as pins and also show guide places. Add city dropdown, zoom buttons and when clicking pin show friend detail or place detail. Use OpenStreetMap tiles if possible.
```

## 6. Friends Module

```text
Make friends page where accepted friends show first and suggested locals show below. User can filter by selected city. Add button for message and add friend. when add friend clicked show request sent.
```

## 7. Chat Module

```text
Build chat screen between current user and selected friend. Show old messages, friend name, online status and message input. It should feel like normal chat app. Also show context place if user asked from map.
```

## 8. Guides Listing Module

```text
Create guides page for local travel guides. Show cards with city, title, author and updated date. Add city filter chips and new guide button. Card should open guide detail page.
```

## 9. Guide Detail Module

```text
Make guide detail page for LocalLens. It should show must visit places, hidden spots, best timing, do and donts, and tips from local person. Keep it clean and easy to read.
```

## 10. New Guide Form

```text
Add form to create new guide. User should enter city, title, must visit places, hidden spots, best timings, dos, donts and tips. Use simple inputs and textarea. Validate empty fields little bit.
```

## 11. Travel Itinerary Module

```text
Create travel itinerary page. User selects places from top 10 city places and guide recommended places. Then enter arrival time and places per day. Generate day wise plan and order places by nearest distance, not random.
```

## 12. City Storybook Module

```text
Make city storybook page. After selecting city, show top 10 places with image, rank, name and description. If image fail then show fallback image. Design should look like travel cards.
```

## 13. Authentication

```text
Add login and signup pages using Clerk for TanStack React Start. After login redirect user to dashboard. Make auth page match LocalLens theme and add nice left side travel quote.
```

## 14. Database Schema

```text
Help me design sqlite schema for LocalLens. Need tables for users, friendships, guides, posts, conversations, messages, city maps, live locations, guide places and city top places. Add foreign keys and indexes also.
```

## 15. Seed Data

```text
Create seed data for indian cities like Jaipur, Bengaluru, Mumbai, Delhi, Goa, Varanasi and Kochi. Add users, friends, posts, guides, live locations and top 10 places. Make data realistic for travel app.
```

## 16. UI Styling

```text
Improve full UI styling in styles.css. Use travel app colors like teal and ocean gradient. Add dark mode support, cards, buttons, sidebar and responsive spacing. Dont make it too flashy.
```

## 17. Responsive Design Fix

```text
Check this page layout and make it responsive for mobile. Some cards are becoming too wide and map is not fitting properly. Fix using grid and flex but dont change the full design.
```

## 18. TypeScript Error Fixing

```text
I am getting typescript errors in TanStack routes. Please fix loader data types and search params validation. Dont remove existing logic, just make it compile properly.
```

## 19. Build and Deployment Fix

```text
npm run build is failing. Please check vite/tanstack/cloudflare config and fix build errors. I need it ready for deploy with wrangler.
```

## 20. Codex Debugging Prompt

```text
Please inspect my LocalLens project and find why selected city is not persisting between dashboard, map and guides page. Fix it cleanly using existing helper file if possible.
```

## 21. Documentation Prompt

```text
Make short documentation of prompts used for LocalLens project. Mention first scaffold was made using Lovable, then I used VS Code ChatGPT and Codex for improving modules, fixing bugs and adding database.
```

