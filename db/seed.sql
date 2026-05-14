PRAGMA foreign_keys = ON;

DELETE FROM guide_places;
DELETE FROM city_top_places;
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

INSERT INTO city_top_places (id, city, rank, name, description, image_url) VALUES
  ('tp_jaipur_1', 'Jaipur', 1, 'Amber Fort', 'A hilltop Rajput fort with mirrored halls, ramparts, and sweeping views over Maota Lake.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/960px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg'),
  ('tp_jaipur_2', 'Jaipur', 2, 'Hawa Mahal', 'The iconic pink sandstone facade built for royal women to watch the city without being seen.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg'),
  ('tp_jaipur_3', 'Jaipur', 3, 'City Palace', 'A graceful palace complex of courtyards, museums, textiles, and royal Jaipur architecture.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chandra_Mahal%2C_City_Palace%2C_Jaipur%2C_20191218_0951_9043.jpg/960px-Chandra_Mahal%2C_City_Palace%2C_Jaipur%2C_20191218_0951_9043.jpg'),
  ('tp_jaipur_4', 'Jaipur', 4, 'Jantar Mantar', 'An open-air astronomical observatory where giant stone instruments still track the sky.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Jantar_Mantar_at_Jaipur.jpg/960px-Jantar_Mantar_at_Jaipur.jpg'),
  ('tp_jaipur_5', 'Jaipur', 5, 'Nahargarh Fort', 'A ridge-top sunset spot with old ramparts and one of the best wide-angle views of Jaipur.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nahargarh_13.jpg/960px-Nahargarh_13.jpg'),
  ('tp_jaipur_6', 'Jaipur', 6, 'Patrika Gate', 'A vividly painted gateway that turns Rajasthani craft motifs into a walk-through gallery.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Patrika_Gate%2C_Jawahar_Circle%2C_Jaipur.jpg/960px-Patrika_Gate%2C_Jawahar_Circle%2C_Jaipur.jpg'),
  ('tp_jaipur_7', 'Jaipur', 7, 'Albert Hall Museum', 'A Indo-Saracenic museum with sculpture, miniature paintings, carpets, and evening lights.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Albert_Hall_%28_Jaipur_%29.jpg/960px-Albert_Hall_%28_Jaipur_%29.jpg'),
  ('tp_jaipur_8', 'Jaipur', 8, 'Jal Mahal', 'A dreamy water palace best seen from the lakeside promenade at sunrise or blue hour.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Jaipur_03-2016_39_Jal_Mahal_-_Water_Palace.jpg/960px-Jaipur_03-2016_39_Jal_Mahal_-_Water_Palace.jpg'),
  ('tp_jaipur_9', 'Jaipur', 9, 'Bapu Bazaar', 'A lively shopping stretch for juttis, textiles, bangles, and bargaining practice.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Jaipur_market.jpg/960px-Jaipur_market.jpg'),
  ('tp_jaipur_10', 'Jaipur', 10, 'Panna Meena ka Kund', 'A geometric stepwell near Amer that is quietest in the early morning.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/20191219_Panna_Meena_ka_Kund_step_well%2C_Amber%2C_Jaipur%2C_1130_9630.jpg/960px-20191219_Panna_Meena_ka_Kund_step_well%2C_Amber%2C_Jaipur%2C_1130_9630.jpg'),
  ('tp_bengaluru_1', 'Bengaluru', 1, 'Cubbon Park', 'A green breathing space in the city center with walking paths, red buildings, and old trees.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Entrance_to_Cubbon_Park_%28Sri_Chamarajendra_Park%29.jpg/960px-Entrance_to_Cubbon_Park_%28Sri_Chamarajendra_Park%29.jpg'),
  ('tp_bengaluru_2', 'Bengaluru', 2, 'Lalbagh Botanical Garden', 'A historic garden known for its glasshouse, rare trees, and peaceful morning walks.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Indian_Independence_day_celebration_216th_flower_show_2024%2C_Lalbagh%2C_Bangalore_129.jpg/960px-Indian_Independence_day_celebration_216th_flower_show_2024%2C_Lalbagh%2C_Bangalore_129.jpg'),
  ('tp_bengaluru_3', 'Bengaluru', 3, 'Bangalore Palace', 'A Tudor-style palace with carved interiors and a nostalgic royal-city feel.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Bangalore_Palace_facade_on_a_cloudy_day.jpg/960px-Bangalore_Palace_facade_on_a_cloudy_day.jpg'),
  ('tp_bengaluru_4', 'Bengaluru', 4, 'Vidhana Soudha', 'A monumental granite government building that is especially striking when lit at night.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vidhana_Soudha%2C_front_%2801%29.jpg/960px-Vidhana_Soudha%2C_front_%2801%29.jpg'),
  ('tp_bengaluru_5', 'Bengaluru', 5, 'Tipu Sultan''s Summer Palace', 'A teakwood palace with arches, balconies, and stories from old Mysore.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tipu_Sultan%27s_Summer_Palace%2C_Bangalore.JPG/960px-Tipu_Sultan%27s_Summer_Palace%2C_Bangalore.JPG'),
  ('tp_bengaluru_6', 'Bengaluru', 6, 'KR Market', 'A sensory overload of flowers, produce, color, and old-market energy before sunrise.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/KR_Market_Workers.jpg/960px-KR_Market_Workers.jpg'),
  ('tp_bengaluru_7', 'Bengaluru', 7, 'Bull Temple', 'A calm Basavanagudi shrine built around a massive granite Nandi statue.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Sri_Big_Bull_Temple_%28Bengaluru%29_01.jpg/960px-Sri_Big_Bull_Temple_%28Bengaluru%29_01.jpg'),
  ('tp_bengaluru_8', 'Bengaluru', 8, 'Commercial Street', 'A compact shopping district for clothes, shoes, accessories, and quick street snacks.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Commercial_Street_Bangalore.jpg/960px-Commercial_Street_Bangalore.jpg'),
  ('tp_bengaluru_9', 'Bengaluru', 9, 'Nandi Hills', 'A classic sunrise escape outside the city with mist, viewpoints, and winding roads.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Nandi_Hills%2C_Bengaluru.jpg/960px-Nandi_Hills%2C_Bengaluru.jpg'),
  ('tp_bengaluru_10', 'Bengaluru', 10, 'Church Street', 'A walkable strip of cafes, bookstores, murals, and evening city buzz.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Church_Street_name_board.jpg/960px-Church_Street_name_board.jpg'),
  ('tp_mumbai_1', 'Mumbai', 1, 'Gateway of India', 'Mumbai''s grand harbor landmark and the classic starting point for a south-city walk.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/960px-Mumbai_03-2016_30_Gateway_of_India.jpg'),
  ('tp_mumbai_2', 'Mumbai', 2, 'Marine Drive', 'A sweeping seaside promenade where the city slows down at sunset.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg/960px-Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg'),
  ('tp_mumbai_3', 'Mumbai', 3, 'Chhatrapati Shivaji Maharaj Terminus', 'A UNESCO-listed railway station with Gothic detail and constant Mumbai motion.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chhatrapati_shivaji_terminus%2C_esterno_01.jpg/960px-Chhatrapati_shivaji_terminus%2C_esterno_01.jpg'),
  ('tp_mumbai_4', 'Mumbai', 4, 'Elephanta Caves', 'A ferry ride to ancient rock-cut caves dedicated to Shiva.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Elephanta_Caves_Trimurti.jpg/960px-Elephanta_Caves_Trimurti.jpg'),
  ('tp_mumbai_5', 'Mumbai', 5, 'Bandra Bandstand', 'A breezy sea-facing stretch with street food, skyline views, and old Bandra charm.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Bandra_Bandstand.jpg/960px-Bandra_Bandstand.jpg'),
  ('tp_mumbai_6', 'Mumbai', 6, 'Colaba Causeway', 'A lively shopping lane for jewelry, clothes, antiques, and cafe breaks.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Colaba_Causeway_-_panoramio_%282%29.jpg/960px-Colaba_Causeway_-_panoramio_%282%29.jpg'),
  ('tp_mumbai_7', 'Mumbai', 7, 'Haji Ali Dargah', 'A sea-linked shrine reached by a narrow causeway at low tide.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mumbai_03-2016_12_Haji_Ali_Dargah.jpg/960px-Mumbai_03-2016_12_Haji_Ali_Dargah.jpg'),
  ('tp_mumbai_8', 'Mumbai', 8, 'Sanjay Gandhi National Park', 'A rare urban national park with forest trails, caves, and monsoon greens.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Sanjay_Gandhi_National_Park.JPG/960px-Sanjay_Gandhi_National_Park.JPG'),
  ('tp_mumbai_9', 'Mumbai', 9, 'Juhu Beach', 'A casual beach stop for sunset, chaat, and people-watching.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Juhu_beach_%28Arial%29.jpg/960px-Juhu_beach_%28Arial%29.jpg'),
  ('tp_mumbai_10', 'Mumbai', 10, 'Kala Ghoda', 'An art district with galleries, museums, cafes, and heritage facades.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Kala_Ghoda_Statue.jpg/960px-Kala_Ghoda_Statue.jpg'),
  ('tp_delhi_1', 'Delhi', 1, 'Red Fort', 'A grand Mughal fort of red sandstone that anchors Old Delhi''s historic core.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/3840px-Delhi_fort.jpg'),
  ('tp_delhi_2', 'Delhi', 2, 'Qutub Minar', 'A soaring minaret surrounded by ruins, arches, and centuries of Delhi history.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/3840px-Qutb_Minar_2022.jpg'),
  ('tp_delhi_3', 'Delhi', 3, 'Humayun''s Tomb', 'A serene garden tomb that helped inspire the architectural language of the Taj Mahal.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Tomb_of_Humayun%2C_Delhi.jpg/3840px-Tomb_of_Humayun%2C_Delhi.jpg'),
  ('tp_delhi_4', 'Delhi', 4, 'India Gate', 'A central ceremonial landmark best experienced in the evening glow.', 'https://upload.wikimedia.org/wikipedia/commons/7/75/India_Gate_%28All_India_War_Memorial%29.jpg'),
  ('tp_delhi_5', 'Delhi', 5, 'Lotus Temple', 'A white marble house of worship known for its petal-like form and quiet interior.', 'https://upload.wikimedia.org/wikipedia/commons/f/fc/LotusDelhi.jpg'),
  ('tp_delhi_6', 'Delhi', 6, 'Chandni Chowk', 'A dense Old Delhi market of parathas, lanes, spice shops, and layered history.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Gurudwara_Sisganj_Sahib_Chandni_Chowk_19.jpg/3840px-Gurudwara_Sisganj_Sahib_Chandni_Chowk_19.jpg'),
  ('tp_delhi_7', 'Delhi', 7, 'Jama Masjid', 'One of India''s largest mosques, with minarets and views over Old Delhi.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Jama_Masjid%2C_Delhi.jpg/960px-Jama_Masjid%2C_Delhi.jpg'),
  ('tp_delhi_8', 'Delhi', 8, 'Lodhi Garden', 'A leafy park where tombs, joggers, and picnic blankets share the morning.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Lodhi_Garden_-_Delhi.png/960px-Lodhi_Garden_-_Delhi.png'),
  ('tp_delhi_9', 'Delhi', 9, 'Akshardham', 'A vast temple complex known for carved stone, gardens, and evening shows.', 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Akshardham_Delhi.jpg'),
  ('tp_delhi_10', 'Delhi', 10, 'Hauz Khas Village', 'A mix of medieval ruins, a lake, boutiques, and cafe culture.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Hauz_Khas_village.jpg/960px-Hauz_Khas_village.jpg'),
  ('tp_goa_1', 'Goa', 1, 'Fontainhas', 'A colorful Latin Quarter of narrow lanes, old homes, galleries, and quiet cafes.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Road_along_Vasco-da-gama_residence_in_Fontainhas%2C_Panaji.jpg/960px-Road_along_Vasco-da-gama_residence_in_Fontainhas%2C_Panaji.jpg'),
  ('tp_goa_2', 'Goa', 2, 'Basilica of Bom Jesus', 'A UNESCO-listed church in Old Goa with baroque detail and deep colonial history.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Side_Elevation_of_Basilica_of_Bom_Jesus.jpg/960px-Side_Elevation_of_Basilica_of_Bom_Jesus.jpg'),
  ('tp_goa_3', 'Goa', 3, 'Fort Aguada', 'A sea-facing Portuguese fort with lighthouse views over the Arabian Sea.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Fort_Aguada_Remote_view_25012016.jpg/960px-Fort_Aguada_Remote_view_25012016.jpg'),
  ('tp_goa_4', 'Goa', 4, 'Dudhsagar Falls', 'A dramatic waterfall that roars through forested hills after the monsoon.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Dudhsagar_falls_Entry_gate_Goa.jpg/960px-Dudhsagar_falls_Entry_gate_Goa.jpg'),
  ('tp_goa_5', 'Goa', 5, 'Anjuna Beach', 'A relaxed beach known for sunsets, flea markets, and old Goa energy.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Anjuna_Beach%2C_Goa%2C_India%2C_Legendary_Curlies_beach_shack.jpg/960px-Anjuna_Beach%2C_Goa%2C_India%2C_Legendary_Curlies_beach_shack.jpg'),
  ('tp_goa_6', 'Goa', 6, 'Chapora Fort', 'A breezy hilltop fort overlooking Vagator and the Chapora River.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fort_Chapora_26012016.jpg/960px-Fort_Chapora_26012016.jpg'),
  ('tp_goa_7', 'Goa', 7, 'Palolem Beach', 'A crescent beach in South Goa with calmer water and sunset kayak rides.', 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Palolem_beach.jpg'),
  ('tp_goa_8', 'Goa', 8, 'Reis Magos Fort', 'A restored fort with river views, exhibitions, and fewer crowds.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Entrance_to_Reis_Magos_Fort.jpg/960px-Entrance_to_Reis_Magos_Fort.jpg'),
  ('tp_goa_9', 'Goa', 9, 'Mapusa Market', 'A local market for spices, sausages, produce, sweets, and Goan everyday life.', 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Mapusa_Market.jpg'),
  ('tp_goa_10', 'Goa', 10, 'Divar Island', 'A quiet ferry-hop island of churches, paddy fields, and slow village roads.', 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Divar_caves.jpg'),
  ('tp_varanasi_1', 'Varanasi', 1, 'Dashashwamedh Ghat', 'The city''s most theatrical ghat, best known for the evening Ganga Aarti.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/960px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg'),
  ('tp_varanasi_2', 'Varanasi', 2, 'Assi Ghat', 'A calmer southern ghat for sunrise, music, yoga, and long riverside walks.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Assi_Ghat_Varanasi_morning_Aarti.jpg/960px-Assi_Ghat_Varanasi_morning_Aarti.jpg'),
  ('tp_varanasi_3', 'Varanasi', 3, 'Kashi Vishwanath Temple', 'One of India''s most sacred Shiva temples in the heart of the old city.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kashi_Vishwanath.jpg/960px-Kashi_Vishwanath.jpg'),
  ('tp_varanasi_4', 'Varanasi', 4, 'Sarnath', 'A peaceful Buddhist site where the Buddha is said to have given his first sermon.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg/960px-Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg'),
  ('tp_varanasi_5', 'Varanasi', 5, 'Manikarnika Ghat', 'A powerful cremation ghat that reveals the city''s intimate relationship with mortality.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282011%29_5.jpg/960px-Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282011%29_5.jpg'),
  ('tp_varanasi_6', 'Varanasi', 6, 'Ramnagar Fort', 'A riverside fort with old-world courtyards and views back toward Varanasi.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Entrance_area_of_Ramnagar_Fort.jpg/960px-Entrance_area_of_Ramnagar_Fort.jpg'),
  ('tp_varanasi_7', 'Varanasi', 7, 'Banaras Hindu University', 'A leafy campus with museums, temples, and a quieter side of the city.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/New_Vishwanath_Temple%2C_Banaras_Hindu_University%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282018%29.jpg/960px-New_Vishwanath_Temple%2C_Banaras_Hindu_University%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282018%29.jpg'),
  ('tp_varanasi_8', 'Varanasi', 8, 'Tulsi Manas Temple', 'A marble temple tied to the Ramcharitmanas and devotional storytelling.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Manas_Mandir.jpg/960px-Manas_Mandir.jpg'),
  ('tp_varanasi_9', 'Varanasi', 9, 'Godowlia Market', 'A crowded old-market zone for sweets, silk, flowers, and street snacks.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Godowlia%2C_Varanasi%2C_Uttar_Pradesh_221001%2C_India_-_panoramio.jpg/960px-Godowlia%2C_Varanasi%2C_Uttar_Pradesh_221001%2C_India_-_panoramio.jpg'),
  ('tp_varanasi_10', 'Varanasi', 10, 'Ganga Boat Ride', 'A sunrise boat ride that strings together ghats, rituals, birds, and morning light.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Varanasiganga.jpg/960px-Varanasiganga.jpg'),
  ('tp_kochi_1', 'Kochi', 1, 'Fort Kochi', 'A walkable heritage quarter of colonial streets, cafes, galleries, and sea breeze.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg/3840px-Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg'),
  ('tp_kochi_2', 'Kochi', 2, 'Chinese Fishing Nets', 'Cantilevered fishing nets that define the Fort Kochi waterfront at sunset.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Chinese_Fishing_Net_Raising_Birds_Sunrise_Ashtamudi_Kollam_Mar22_A7C_01784.jpg/3840px-Chinese_Fishing_Net_Raising_Birds_Sunrise_Ashtamudi_Kollam_Mar22_A7C_01784.jpg'),
  ('tp_kochi_3', 'Kochi', 3, 'Mattancherry Palace', 'A compact palace museum with Kerala murals and layered royal history.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mattancherry_Palace_DSC_0899.JPG/3840px-Mattancherry_Palace_DSC_0899.JPG'),
  ('tp_kochi_4', 'Kochi', 4, 'Jew Town', 'A charming lane of antique stores, spice shops, and synagogue history.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kochi%2C_Jew_Town%2C_India.jpg/960px-Kochi%2C_Jew_Town%2C_India.jpg'),
  ('tp_kochi_5', 'Kochi', 5, 'Paradesi Synagogue', 'A historic synagogue known for blue tiles, chandeliers, and quiet courtyards.', 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Jewish_synagouge_kochi_india.jpg'),
  ('tp_kochi_6', 'Kochi', 6, 'Marine Drive', 'A waterside promenade for ferry views, evening walks, and city lights.', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Musical-walkway.jpg'),
  ('tp_kochi_7', 'Kochi', 7, 'Kerala Folklore Museum', 'A richly packed museum of masks, carvings, costumes, and performance traditions.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2025_-_Kerala_Folklore_Museum_-_13.jpg/960px-2025_-_Kerala_Folklore_Museum_-_13.jpg'),
  ('tp_kochi_8', 'Kochi', 8, 'Cherai Beach', 'A relaxed beach north of the city where backwaters meet the sea.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sunrise_at_Cherai_Beach.jpg/960px-Sunrise_at_Cherai_Beach.jpg'),
  ('tp_kochi_9', 'Kochi', 9, 'Bolgatty Palace', 'A former Dutch palace on an island with lawns and backwater views.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Bolgatty_Palace_Hotel_by_Augustus.jpg/960px-Bolgatty_Palace_Hotel_by_Augustus.jpg'),
  ('tp_kochi_10', 'Kochi', 10, 'Kumbalangi Village', 'A slow village experience of backwaters, fish farms, and local life.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Kumbalangi.JPG/960px-Kumbalangi.JPG');
