import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/shravan_dev';

function extractDataUrlBase64(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const parts = dataUrl.split(',');
  return parts[1] ?? null;
}

function normalizeStringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value).split(',').map((v) => v.trim()).filter(Boolean);
}

function normalizeMedia(value) {
  if (!value) return null;
  if (typeof value === 'string') return { url: value };
  if (Array.isArray(value)) return value.map(normalizeMedia).filter(Boolean);
  if (typeof value === 'object') {
    const media = value;
    if (media.url) return { url: media.url, name: media.name ?? media.filename ?? null, type: media.type ?? null };
    const base64 = media.data ?? media.dataBase64 ?? extractDataUrlBase64(media.url ?? media.data ?? '');
    if (base64) return { dataBase64: base64, name: media.name ?? media.filename ?? null, type: media.type ?? null };
  }
  return null;
}

function mapProduct(doc) {
  const title = String(doc.name ?? doc.title ?? '').trim() || 'Untitled Product';
  const slug = String(doc.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');

  return {
    _id: doc._id,
    name: title,
    slug,
    subtitle: doc.subtitle ?? null,
    category_id: doc.category_id ?? null,
    category_slug: doc.category_slug ?? null,
    featured: Boolean(doc.featured),
    status: doc.status ?? 'published',
    image: normalizeMedia(doc.image) ?? normalizeMedia(doc.og_image) ?? null,
    gallery_images: Array.isArray(doc.gallery_images) ? doc.gallery_images.map(normalizeMedia).filter(Boolean) : [],
    application_images: Array.isArray(doc.application_images) ? doc.application_images.map(normalizeMedia).filter(Boolean) : [],
    brochure_pdf: normalizeMedia(doc.brochure_pdf) ?? null,
    tds_pdf: normalizeMedia(doc.tds_pdf) ?? null,
    msds_pdf: normalizeMedia(doc.msds_pdf) ?? null,
    certificate: normalizeMedia(doc.certificate) ?? null,
    applications: normalizeStringArray(doc.application_rows ?? doc.applications),
    industries_served: normalizeStringArray(doc.industries_served ?? doc.industries),
    tags: normalizeStringArray(doc.tags),
    short_description: doc.short_description ?? null,
    detailed_description: doc.detailed_description ?? null,
    product_details: doc.product_details ?? null,
    key_features: doc.key_features ?? null,
    benefits: doc.benefits ?? null,
    packaging_details: doc.packaging_details ?? null,
    storage_instructions: doc.storage_instructions ?? null,
    safety_notes: doc.safety_notes ?? null,
    technical_specifications: doc.technical_specifications ?? null,
    specification_rows: Array.isArray(doc.specification_rows) ? doc.specification_rows : [],
    contact_details: doc.contact_details ?? null,
    updatedAt: new Date().toISOString(),
    createdAt: doc.createdAt ?? new Date().toISOString(),
  };
}

(async function run() {
  console.log('Connecting to', MONGO_URL);
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db();
  const products = db.collection('products');

  const cursor = products.find({});
  let count = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const mapped = mapProduct(doc);

    const updates = { ...mapped };
    delete updates._id;

    await products.updateOne({ _id: new ObjectId(doc._id) }, { $set: updates });
    count++;
    if (count % 50 === 0) console.log('Processed', count);
  }

  console.log('Processed', count, 'products');
  await client.close();
})().catch((err) => { console.error(err); process.exit(1); });
