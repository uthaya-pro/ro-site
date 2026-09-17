-- TUTY RO Purifier — Seed Data
-- Run AFTER schema.sql to populate initial data

USE tuty_ro_purifier;

-- ─────────────────────────────────────────────────────────────
-- Admin (username: admin, password: admin@123)
-- bcrypt hash of "admin@123" with 10 rounds
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO admins (username, email, password_hash) VALUES
('admin', 'admin@tutyroPurifier.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- ─────────────────────────────────────────────────────────────
-- Business Settings
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO business_settings (setting_key, setting_value) VALUES
('business_name',   'TUTY RO Purifier'),
('tagline',         'Pure Water. Healthy Life.'),
('phone',           '+91 98765 43210'),
('whatsapp_number', '919876543210'),
('email',           'info@tutyroPurifier.com'),
('address',         '123, Main Road, Thoothukudi, Tamil Nadu - 628001'),
('business_hours',  'Mon–Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM'),
('google_maps_link','https://maps.google.com/?q=Thoothukudi,Tamil+Nadu'),
('facebook_url',    ''),
('instagram_url',   ''),
('youtube_url',     ''),
('logo_url',        '');

-- ─────────────────────────────────────────────────────────────
-- Sample Products
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO products (name, slug, description, price, capacity, technology, features, is_active, sort_order) VALUES
(
  'TUTY Pure Pro 10L',
  'tuty-pure-pro-10l',
  'Our bestselling RO purifier with 7-stage purification for crystal-clear, safe drinking water. Perfect for families of 4–6 members.',
  12999.00,
  '10 Litres/Hour',
  'RO + UV + TDS Controller',
  '["7-Stage Purification","Mineral Retention Technology","LED Indicator","Auto Shut-Off","Food-Grade ABS Plastic","1 Year Comprehensive Warranty"]',
  1, 1
),
(
  'TUTY Aqua 6L Compact',
  'tuty-aqua-6l-compact',
  'Space-saving compact RO purifier ideal for small families and apartments. Advanced 5-stage filtration delivers pure water at an affordable price.',
  8499.00,
  '6 Litres/Hour',
  'RO + UV',
  '["5-Stage Purification","Compact Wall-Mount Design","UV Sterilisation","Pre-filter & Post-filter","2 Years Motor Warranty","Energy Saving Mode"]',
  1, 2
),
(
  'TUTY Smart 15L Commercial',
  'tuty-smart-15l-commercial',
  'High-capacity commercial-grade RO purifier for offices, restaurants, and shops. Handles high TDS water with ease.',
  24999.00,
  '15 Litres/Hour',
  'RO + UV + UF + TDS Controller',
  '["9-Stage Deep Purification","Digital Display","Smart Purification Alert","High Flow Rate","Stainless Steel Tank Option","3 Years Warranty"]',
  1, 3
),
(
  'TUTY Basic 5L',
  'tuty-basic-5l',
  'Entry-level RO purifier delivering safe purified water at the most affordable price. Ideal for small families and budget buyers.',
  5999.00,
  '5 Litres/Hour',
  'RO + Sediment Filter',
  '["4-Stage Purification","Wall Mountable","Low Maintenance","Compact Size","1 Year Warranty"]',
  1, 4
),
(
  'TUTY Premium Alkaline 12L',
  'tuty-premium-alkaline-12l',
  'Premium alkaline RO purifier that adds essential minerals back into the purified water, ensuring optimal pH balance for your health.',
  18499.00,
  '12 Litres/Hour',
  'RO + UV + Alkaline + Mineraliser',
  '["8-Stage Purification","Alkaline Mineraliser","pH Balancer","Copper-Infused Filter Option","Smart TDS Display","2 Year Comprehensive Warranty"]',
  1, 5
);

-- ─────────────────────────────────────────────────────────────
-- Sample Services
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO services (name, description, price_info, icon, is_active, sort_order) VALUES
(
  'RO Installation',
  'Professional installation of your new RO purifier by our certified technicians. Includes wall mounting, pipe connection, and test run.',
  'Starting ₹499',
  'FaTools',
  1, 1
),
(
  'RO Service & Maintenance',
  'Complete periodic servicing of your RO system. Cleaning of all filters, membrane check, and performance testing.',
  'Starting ₹299',
  'FaWrench',
  1, 2
),
(
  'Filter Replacement',
  'Genuine filter and membrane replacement for all major RO brands. We carry all standard sizes and types.',
  'Starting ₹199',
  'FaFilter',
  1, 3
),
(
  'RO Repair',
  'Fast and reliable repair service for any RO purifier brand or model. Same-day service available.',
  'Starting ₹349',
  'FaScrewdriver',
  1, 4
),
(
  'Annual Maintenance Contract (AMC)',
  'Comprehensive yearly AMC plans covering 2 free services, priority support, and discounted filter replacements.',
  'Starting ₹999/year',
  'FaClipboardCheck',
  1, 5
),
(
  'Water Quality Testing',
  'Free water TDS and quality testing at your home to help you choose the right RO system for your needs.',
  'FREE',
  'FaFlask',
  1, 6
);

-- ─────────────────────────────────────────────────────────────
-- Welcome notification
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO notifications (title, message, type) VALUES
('Welcome to TUTY RO Admin', 'Your admin panel is ready. Start by updating business settings and adding products.', 'system');

SELECT 'Seed data inserted successfully!' AS result;
