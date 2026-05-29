import { MongoClient, ObjectId } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/website-weaver-kit';
const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

function extractDataUrlBase64(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const parts = dataUrl.split(',');
  return parts[1] ?? null;
}

(async function run() {
  console.log('Connecting to', MONGO_URL);
  await mkdir(uploadsDir, { recursive: true });
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db();
  const coll = db.collection('generated_pdfs');

  const cursor = coll.find({ $or: [{ dataBase64: { $exists: true } }, { data: { $exists: true } }] });
  let count = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const base64 = doc.dataBase64 ?? doc.data ?? extractDataUrlBase64(doc.url ?? doc.data ?? '');
    if (!base64) continue;

    const extFromName = doc.filename ? path.extname(doc.filename).replace(/^\./, '') : '';
    const extFromType = doc.contentType ? (doc.contentType.split('/')[1] || '') : '';
    const ext = extFromName || extFromType || 'bin';
    const filename = `${randomUUID()}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, Buffer.from(base64, 'base64'));

    const updates = {
      $set: {
        filename,
        originalFilename: doc.filename ?? null,
        filePath,
        updatedAt: new Date().toISOString(),
      },
      $unset: {
        dataBase64: '',
        data: '',
      },
    };

    await coll.updateOne({ _id: doc._id }, updates);
    count++;
    if (count % 20 === 0) console.log('Migrated', count);
  }

  console.log('Migrated', count, 'generated_pdfs to files in', uploadsDir);
  await client.close();
})().catch((err) => { console.error(err); process.exit(1); });
