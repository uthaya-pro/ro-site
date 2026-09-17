/**
 * TUTY RO Purifier — MongoDB Seed Script
 * Run: node config/setup-db.js
 *
 * Connects to MongoDB, seeds all initial data.
 * Safe to re-run (uses upsert / findOneAndUpdate).
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Models
const Admin        = require('../models/Admin');
const Product      = require('../models/Product');
const Service      = require('../models/Service');
const Notification = require('../models/Notification');
const Setting      = require('../models/Setting');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tuty_ro_purifier';

// ─── SRV resolver using Google DNS (mirrors config/db.js) ──────────────────
async function resolveAtlasURI(uri) {
  if (!uri.startsWith('mongodb+srv://')) return uri;
  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(.*)?$/);
  if (!match) return uri;
  const [, user, pass, host, dbPart = '/test'] = match;
  const db = dbPart.replace('/', '') || 'test';
  const resolver = new dns.promises.Resolver();
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
  const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
  let extraOpts = '';
  try {
    const txtRecords = await resolver.resolveTxt(host);
    extraOpts = txtRecords.flat().join('&');
  } catch { /* TXT optional */ }
  const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');
  const params = new URLSearchParams(extraOpts);
  params.set('tls', 'true');
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts}/${db}?${params.toString()}`;
}

async function seed() {
  console.log('\n🔧 TUTY RO Purifier — MongoDB Seed\n');

  const resolvedURI = await resolveAtlasURI(MONGODB_URI);
  await mongoose.connect(resolvedURI, { serverSelectionTimeoutMS: 30000, family: 4 });
  console.log('✅ Connected to MongoDB');

  // ─── Admin ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin@123', 10);
  await Admin.findOneAndUpdate(
    { username: 'admin' },
    { username: 'admin', email: 'admin@tutyroPurifier.com', password_hash: passwordHash },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  console.log('✅ Admin seeded  (username: admin | password: admin@123)');

  // ─── Business Settings ────────────────────────────────────────────────────
  const settingsList = [
    { key: 'business_name',   value: 'TUTY RO Purifier' },
    { key: 'tagline',         value: 'Pure Water. Healthy Life.' },
    { key: 'phone',           value: '+91 98765 43210' },
    { key: 'whatsapp_number', value: '919876543210' },
    { key: 'email',           value: 'info@tutyroPurifier.com' },
    { key: 'address',         value: '123, Main Road, Thoothukudi, Tamil Nadu - 628001' },
    { key: 'business_hours',  value: 'Mon–Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM' },
    { key: 'google_maps_link',value: 'https://maps.google.com/?q=Thoothukudi,Tamil+Nadu' },
    { key: 'facebook_url',    value: '' },
    { key: 'instagram_url',   value: '' },
    { key: 'youtube_url',     value: '' },
    { key: 'logo_url',        value: '' },
  ];

  for (const s of settingsList) {
    await Setting.findOneAndUpdate({ key: s.key }, s, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log('✅ Business settings seeded');

  // ─── Products ─────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'TUTY Pure Pro 10L',
      slug: 'tuty-pure-pro-10l',
      description: 'Our bestselling RO purifier with 7-stage purification for crystal-clear, safe drinking water. Perfect for families of 4–6 members.',
      price: 12999,
      capacity: '10 Litres/Hour',
      technology: 'RO + UV + TDS Controller',
      features: ['7-Stage Purification','Mineral Retention Technology','LED Indicator','Auto Shut-Off','Food-Grade ABS Plastic','1 Year Comprehensive Warranty'],
      is_active: true,
      sort_order: 1,
    },
    {
      name: 'TUTY Aqua 6L Compact',
      slug: 'tuty-aqua-6l-compact',
      description: 'Space-saving compact RO purifier ideal for small families and apartments. Advanced 5-stage filtration delivers pure water at an affordable price.',
      price: 8499,
      capacity: '6 Litres/Hour',
      technology: 'RO + UV',
      features: ['5-Stage Purification','Compact Wall-Mount Design','UV Sterilisation','Pre-filter & Post-filter','2 Years Motor Warranty','Energy Saving Mode'],
      is_active: true,
      sort_order: 2,
    },
    {
      name: 'TUTY Smart 15L Commercial',
      slug: 'tuty-smart-15l-commercial',
      description: 'High-capacity commercial-grade RO purifier for offices, restaurants, and shops. Handles high TDS water with ease.',
      price: 24999,
      capacity: '15 Litres/Hour',
      technology: 'RO + UV + UF + TDS Controller',
      features: ['9-Stage Deep Purification','Digital Display','Smart Purification Alert','High Flow Rate','Stainless Steel Tank Option','3 Years Warranty'],
      is_active: true,
      sort_order: 3,
    },
    {
      name: 'TUTY Basic 5L',
      slug: 'tuty-basic-5l',
      description: 'Entry-level RO purifier delivering safe purified water at the most affordable price. Ideal for small families and budget buyers.',
      price: 5999,
      capacity: '5 Litres/Hour',
      technology: 'RO + Sediment Filter',
      features: ['4-Stage Purification','Wall Mountable','Low Maintenance','Compact Size','1 Year Warranty'],
      is_active: true,
      sort_order: 4,
    },
    {
      name: 'TUTY Premium Alkaline 12L',
      slug: 'tuty-premium-alkaline-12l',
      description: 'Premium alkaline RO purifier that adds essential minerals back into the purified water, ensuring optimal pH balance for your health.',
      price: 18499,
      capacity: '12 Litres/Hour',
      technology: 'RO + UV + Alkaline + Mineraliser',
      features: ['8-Stage Purification','Alkaline Mineraliser','pH Balancer','Copper-Infused Filter Option','Smart TDS Display','2 Year Comprehensive Warranty'],
      is_active: true,
      sort_order: 5,
    },
  ];

  for (const p of products) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log('✅ Products seeded');

  // ─── Services ─────────────────────────────────────────────────────────────
  const services = [
    { name: 'RO Installation',                description: 'Professional installation of your new RO purifier by our certified technicians. Includes wall mounting, pipe connection, and test run.',                      price_info: 'Starting ₹499',      icon: 'FaTools',          is_active: true, sort_order: 1 },
    { name: 'RO Service & Maintenance',       description: 'Complete periodic servicing of your RO system. Cleaning of all filters, membrane check, and performance testing.',                                            price_info: 'Starting ₹299',      icon: 'FaWrench',         is_active: true, sort_order: 2 },
    { name: 'Filter Replacement',             description: 'Genuine filter and membrane replacement for all major RO brands. We carry all standard sizes and types.',                                                     price_info: 'Starting ₹199',      icon: 'FaFilter',         is_active: true, sort_order: 3 },
    { name: 'RO Repair',                      description: 'Fast and reliable repair service for any RO purifier brand or model. Same-day service available.',                                                            price_info: 'Starting ₹349',      icon: 'FaScrewdriver',    is_active: true, sort_order: 4 },
    { name: 'Annual Maintenance Contract (AMC)', description: 'Comprehensive yearly AMC plans covering 2 free services, priority support, and discounted filter replacements.',                                          price_info: 'Starting ₹999/year', icon: 'FaClipboardCheck', is_active: true, sort_order: 5 },
    { name: 'Water Quality Testing',          description: 'Free water TDS and quality testing at your home to help you choose the right RO system for your needs.',                                                     price_info: 'FREE',               icon: 'FaFlask',          is_active: true, sort_order: 6 },
  ];

  for (const s of services) {
    await Service.findOneAndUpdate({ name: s.name }, s, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log('✅ Services seeded');

  // ─── Welcome Notification ─────────────────────────────────────────────────
  const existingNotif = await Notification.findOne({ title: 'Welcome to TUTY RO Admin' });
  if (!existingNotif) {
    await Notification.create({
      title:   'Welcome to TUTY RO Admin',
      message: 'Your admin panel is ready. Start by updating business settings and adding products.',
      type:    'system',
    });
  }
  console.log('✅ Welcome notification seeded');

  console.log('\n🎉 Database seed complete!\n');
  console.log('─────────────────────────────────────────');
  console.log('Admin Login:');
  console.log('  Username : admin');
  console.log('  Password : admin@123');
  console.log('─────────────────────────────────────────');
  console.log('⚠️  Please change the admin password after first login!\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
