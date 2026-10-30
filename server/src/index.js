import mongoose from 'mongoose';
import { createApp } from './app.js';
import { DEFAULT_ORIGINS, DEFAULT_PORT } from './config.js';
import { parseOrigins } from './cors.js';
import { createGhostStore } from './ghostStore.js';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set.');
  process.exit(1);
}

const store = createGhostStore();
const app = createApp({ store, allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS) });
const port = Number(process.env.PORT) || DEFAULT_PORT;
app.listen(port, () => console.log(`Ghost server on port ${port}`));

await mongoose.connect(uri);
await store.syncIndexes();
console.log('Connected to MongoDB');
