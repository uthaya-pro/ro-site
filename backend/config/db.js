require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tuty_ro_purifier';

// ─── SRV resolver using Google DNS ─────────────────────────────────────────
// Node's system DNS often cannot resolve mongodb+srv:// SRV records.
// We manually resolve via Google (8.8.8.8) and build a standard mongodb:// URI.
async function resolveAtlasURI(uri) {
  if (!uri.startsWith('mongodb+srv://')) return uri;

  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(.*)?$/);
  if (!match) return uri;

  const [, user, pass, host, dbPart = '/test', queryPart = ''] = match;
  const db = dbPart.replace('/', '') || 'test';

  const resolver = new dns.promises.Resolver();
  resolver.setServers(['8.8.8.8', '1.1.1.1']);   // Google / Cloudflare DNS

  console.log('🔍 Resolving Atlas SRV records via Google DNS...');
  const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);

  // Resolve TXT record for extra options (authSource, replicaSet, etc.)
  let extraOpts = '';
  try {
    const txtRecords = await resolver.resolveTxt(host);
    extraOpts = txtRecords.flat().join('&');
  } catch { /* TXT optional */ }

  const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');

  // Merge TXT options into a deduped query string (TXT already has authSource & replicaSet)
  const params = new URLSearchParams(extraOpts);
  params.set('tls', 'true');
  const directURI = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts}/${db}?${params.toString()}`;
  console.log(`✅ Resolved to ${srvRecords.length} shard(s) via Google DNS`);
  return directURI;
}

// ─── Connection options ─────────────────────────────────────────────────────
const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS:          60000,
  connectTimeoutMS:         30000,
  maxPoolSize:              10,
  family:                   4,       // Force IPv4
};

let retryTimer = null;
let resolvedURI = null;  // Cache the resolved URI so we only resolve SRV once

async function connectDB() {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }

  try {
    // Resolve SRV on first connection attempt
    if (!resolvedURI) {
      resolvedURI = await resolveAtlasURI(MONGODB_URI);
    }

    await mongoose.connect(resolvedURI, options);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    resolvedURI = null;  // Reset so SRV is re-resolved on next attempt
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Retrying in 5 seconds...');
    retryTimer = setTimeout(connectDB, 5000);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Reconnecting...');
  retryTimer = setTimeout(connectDB, 3000);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('connected', () => {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
});

connectDB();

module.exports = mongoose;
