PRAGMA foreign_keys = ON;

DELETE FROM guide_places;
DELETE FROM live_locations;
DELETE FROM city_maps;
DELETE FROM messages;
DELETE FROM conversations;
DELETE FROM posts;
DELETE FROM guides;
DELETE FROM friendships;
DELETE FROM users;

INSERT INTO users (id, name, city, bio, avatar, online, is_current) VALUES
  ('u_me', 'You', 'Jaipur', 'Traveling slow across India. Chai, forts, and conversations.', 'YO', 0, 1),
  ('u1', 'Aarav Sharma', 'Jaipur', 'Born in the Pink City. Knows every kachori worth queuing for.', 'AS', 1, 0),
  ('u2', 'Priya Iyer', 'Jaipur', 'Block-print designer in Bagru. Loves dawn at Nahargarh.', 'PI', 1, 0),
  ('u3', 'Karthik Menon', 'Bengaluru', 'Coffee snob. Knows every filter kaapi spot in VV Puram.', 'KM', 0, 0),
  ('u4', 'Meera Nair', 'Jaipur', 'Architect. Tile and jharokha spotter.', 'MN', 0, 0),
  ('u5', 'Rohan Kapoor', 'Mumbai', 'Street food cartographer from Bandra to Mohammed Ali Road.', 'RK', 1, 0),
  ('u6', 'Ananya Das', 'Jaipur', 'Bazaar-hopper. Bapu Bazaar to Johari, blindfolded.', 'AD', 0, 0),
  ('u7', 'Ishaan Verma', 'Delhi', 'Old Delhi food walks. Karim''s at midnight.', 'IV', 0, 0);

INSERT INTO friendships (user_id, friend_id, status) VALUES
  ('u_me', 'u1', 'accepted'),
  ('u_me', 'u2', 'accepted'),
  ('u_me', 'u4', 'accepted'),
  ('u_me', 'u6', 'accepted'),
  ('u_me', 'u3', 'accepted'),
  ('u_me', 'u5', 'accepted'),
  ('u_me', 'u7', 'accepted');

INSERT INTO guides (
  id,
  author_id,
  city,
  title,
  must_visit_json,
  hidden_spots_json,
  best_timings,
  dos_json,
  donts_json,
  tips_json,
  updated_at
) VALUES
  (
    'g1',
    'u1',
    'Jaipur',
    'Aarav''s Jaipur — beyond the tourist circuit',
    '["Nahargarh Fort at sunrise (not sunset — fewer people)","Rawat Mishthan Bhandar for pyaaz kachori, before 10am","Patrika Gate at golden hour, but enter from Jawahar Circle side"]',
    '["Panna Meena ka Kund stepwell — quiet at 8am","Anokhi Museum of Hand Printing in Amer","Tapri Central rooftop at C-Scheme for monsoon chai"]',
    'October to March. Avoid May–June (45°C+). Monsoon (July–Sept) is dramatic but humid.',
    '["Bargain in Bapu Bazaar — start at 40% of quoted price","Carry small change for autos and tea stalls","Cover shoulders when entering temples and forts"]',
    '["Don''t book elephant rides at Amer — walk up instead","Don''t accept ''free'' city tours from hotel touts","Don''t trust the first gem dealer in Johari Bazaar"]',
    '["Composite ticket (₹400) covers Amer, Nahargarh, Jantar Mantar, Hawa Mahal — buy at Amer first","Use the Jaipur Metro for Chandpole to Mansarovar — beats traffic"]',
    '2 days ago'
  ),
  (
    'g2',
    'u2',
    'Jaipur',
    'Priya''s craft trail — Bagru to Sanganer',
    '["Bagru village block-print workshops (book ahead)","Sanganer paper-making units near the airport","Anokhi flagship at C-Scheme to see finished work"]',
    '["Studio Bagru — Vijendra ji''s family workshop","Jaipur Rugs flagship in Malviya Nagar"]',
    'November to February. Workshops are closed on Sundays.',
    '["Ask before photographing artisans","Buy directly from karigars, not middlemen shops"]',
    '["Don''t haggle aggressively at workshops — these are fair prices","Don''t believe ''100% natural dye'' tags without asking"]',
    '["Hire a Hindi-speaking driver for Bagru — most karigars don''t speak English"]',
    '5 hours ago'
  ),
  (
    'g3',
    'u3',
    'Bengaluru',
    'Karthik''s filter-kaapi crawl',
    '["Vidyarthi Bhavan in Basavanagudi for masala dosa (cash only)","CTR (Central Tiffin Room) in Malleshwaram for benne masala dosa","Brahmin''s Coffee Bar — chutney recipe is a state secret"]',
    '["Veena Stores in Malleshwaram for idli at 7am","Airlines Hotel — drive-in for late-night dosa"]',
    'November to February. Avoid Outer Ring Road during weekday peak (8–11am, 6–9pm).',
    '["Order ''by-two coffee'' to share — that''s a Bangalore thing","Use Namma Metro to skip traffic"]',
    '["Don''t drive yourself — Ola/Uber or auto is faster","Don''t expect anything to open before 7am except darshinis"]',
    '["Cubbon Park is closed to vehicles on Sundays — best time to walk it"]',
    '1 week ago'
  );

INSERT INTO posts (id, author_id, city, area, body, tag, created_at) VALUES
  ('p1', 'u2', 'Jaipur', 'Nahargarh Fort', 'Sunset right now is unreal — pink sky over the whole city. Skip Hawa Mahal, come here.', 'tip', '12 min ago'),
  ('p2', 'u1', 'Jaipur', 'Hawa Mahal', 'Pickpockets active near Hawa Mahal entrance — keep phones zipped. Tourist police on duty though.', 'warning', '38 min ago'),
  ('p3', 'u4', 'Jaipur', 'Amer', 'Amer Fort light & sound show cancelled tonight due to rain. Refunds at counter.', 'event', '1 hr ago'),
  ('p4', 'u6', 'Jaipur', 'C-Scheme', 'Sudden pre-monsoon shower in C-Scheme. Tapri Central rooftop is the move.', 'weather', '2 hr ago'),
  ('p5', 'u1', 'Jaipur', 'JLN Marg', 'Wedding procession blocking JLN Marg near World Trade Park till ~9pm. Take Tonk Road instead.', 'traffic', '3 hr ago'),
  ('p6', 'u5', 'Mumbai', 'Mohammed Ali Road', 'Ramzan-style late-night kebabs at Bademiya — short queue right now.', 'tip', '4 hr ago'),
  ('p7', 'u7', 'Delhi', 'Chandni Chowk', 'Metro Yellow Line delays — Chawri Bazaar to Kashmere Gate running 15min late.', 'traffic', '20 min ago');

INSERT INTO conversations (id, user_id, friend_id, last_message, last_message_at, unread_count) VALUES
  ('c1', 'u_me', 'u1', 'Try LMB on MI Road, ground floor only — upstairs is overpriced 🙌', '9:41', 2),
  ('c2', 'u_me', 'u2', 'Workshop visit at 11am tomorrow if you''re free', 'Yesterday', 0),
  ('c3', 'u_me', 'u4', 'Sent you the haveli walking route', 'Mon', 0),
  ('c4', 'u_me', 'u6', 'Bapu Bazaar at 7pm. Meet at the gate?', 'Sun', 0);

INSERT INTO messages (id, from_id, to_id, body, sent_at, context_place) VALUES
  ('m1', 'u1', 'u_me', 'Hey! Saw you''re in Jaipur — staying long?', '9:30', NULL),
  ('m2', 'u_me', 'u1', 'Just five days. Where should I get dinner tonight?', '9:32', NULL),
  ('m3', 'u1', 'u_me', 'Skip Chokhi Dhani if it''s just one night — too touristy. Try LMB on MI Road for proper Rajasthani thali.', '9:40', 'Laxmi Misthan Bhandar (LMB)'),
  ('m4', 'u1', 'u_me', 'Try LMB on MI Road, ground floor only — upstairs is overpriced 🙌', '9:41', NULL),
  ('m5', 'u2', 'u_me', 'Workshop visit at 11am tomorrow if you''re free', 'Yesterday', NULL),
  ('m6', 'u4', 'u_me', 'Sent you the haveli walking route', 'Mon', NULL),
  ('m7', 'u6', 'u_me', 'Bapu Bazaar at 7pm. Meet at the gate?', 'Sun', NULL);

INSERT INTO city_maps (city, center_lat, center_lng, west, south, east, north) VALUES
  ('Jaipur', 26.9124, 75.7873, 75.7309, 26.8757, 75.8892, 27.0098),
  ('Bengaluru', 12.9716, 77.5946, 77.517, 12.914, 77.662, 13.047),
  ('Mumbai', 19.076, 72.8777, 72.78, 18.955, 72.94, 19.17),
  ('Delhi', 28.6139, 77.209, 77.155, 28.585, 77.263, 28.681),
  ('Goa', 15.4909, 73.8278, 73.7, 15.38, 73.95, 15.58),
  ('Varanasi', 25.3176, 82.9739, 82.91, 25.25, 83.04, 25.36),
  ('Kochi', 9.9312, 76.2673, 76.21, 9.89, 76.34, 10);

INSERT INTO live_locations (user_id, city, place, lat, lng) VALUES
  ('u1', 'Jaipur', 'Hawa Mahal', 26.9239, 75.8267),
  ('u2', 'Jaipur', 'Nahargarh Fort', 26.9368, 75.8155),
  ('u4', 'Jaipur', 'Amer Fort', 26.9855, 75.8513),
  ('u6', 'Jaipur', 'Bapu Bazaar', 26.9164, 75.8198),
  ('u3', 'Bengaluru', 'Malleshwaram', 13.0031, 77.5643),
  ('u5', 'Mumbai', 'Bandra', 19.0596, 72.8295),
  ('u7', 'Delhi', 'Chandni Chowk', 28.6506, 77.2303);

INSERT INTO guide_places (id, guide_id, name, city, lat, lng) VALUES
  ('gp1', 'g1', 'Nahargarh Fort', 'Jaipur', 26.9368, 75.8155),
  ('gp2', 'g1', 'Rawat Mishthan Bhandar', 'Jaipur', 26.9191, 75.7943),
  ('gp3', 'g1', 'Patrika Gate', 'Jaipur', 26.8412, 75.8001),
  ('gp4', 'g2', 'Bagru block-print workshops', 'Jaipur', 26.8093, 75.5423),
  ('gp5', 'g2', 'Sanganer paper-making units', 'Jaipur', 26.8227, 75.7893),
  ('gp6', 'g3', 'Vidyarthi Bhavan', 'Bengaluru', 12.945, 77.5714),
  ('gp7', 'g3', 'CTR', 'Bengaluru', 12.9982, 77.5697),
  ('gp8', 'g3', 'Brahmin''s Coffee Bar', 'Bengaluru', 12.9556, 77.5683);
