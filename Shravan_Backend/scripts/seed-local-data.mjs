import { spawnSync } from 'child_process';
const target = new URL('../../tools/seed-local-data.mjs', import.meta.url).pathname;
const res = spawnSync(process.execPath, [target], { stdio: 'inherit' });
process.exit(res.status || 0);
import { MongoClient } from "mongodb";
import { pbkdf2Sync, randomBytes } from "crypto";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/website-weaver-kit";
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "princesavaliya039@gmail.com";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Password123!";

const categorySeed = [
  {
    name: "Fiber Reinforcement",
    slug: "fiber-reinforcement",
    short_description: "Industrial-grade fiberglass reinforcements for high-performance composites.",
    banner_image: { url: "/src/assets/fiberglass.jpg" },
    status: "active",
    is_visible: true,
    sort_order: 1,
  },
  {
    name: "Resin & Chemicals",
    slug: "resin-chemicals",
    short_description: "Premium polyester, vinyl ester and epoxy resins with full chemistry support.",
    banner_image: { url: "/src/assets/resin.jpg" },
    status: "active",
    is_visible: true,
    sort_order: 2,
  },
  {
    name: "Vacuum Infusion",
    slug: "vacuum-infusion",
    short_description: "Complete vacuum bagging and infusion consumables for premium composite layups.",
    banner_image: { url: "/src/assets/vacuum.jpg" },
    status: "active",
    is_visible: true,
    sort_order: 3,
  },
  {
    name: "FRP Accessories",
    slug: "frp-accessories",
    short_description: "Professional tools and consumables for clean, efficient FRP fabrication.",
    banner_image: { url: "/src/assets/accessories.jpg" },
    status: "active",
    is_visible: true,
    sort_order: 4,
  },
  {
    name: "Stone Care & Surface",
    slug: "stone-Pro",
    short_description: "Sealers and protection systems engineered for marble & granite.",
    banner_image: { url: "/src/assets/stonecare.jpg" },
    status: "active",
    is_visible: true,
    sort_order: 5,
  },
];

const productSeed = [
  {
    slug: "csm-chopped-strand-mat",
    categorySlug: "fiber-reinforcement",
    name: "CSM (Chopped Strand Mat)",
    short_description: "A versatile fiberglass mat for composite fabrication.",
    detailed_description: "Reliable chopped strand mat for laminations and industrial composite work.",
    image: { url: "/src/assets/fiberglass.jpg" },
    featured: true,
    sort_order: 1,
  },
  {
    slug: "woven-fabric",
    categorySlug: "fiber-reinforcement",
    name: "Woven Fabric",
    short_description: "Tightly woven reinforcement fabric.",
    detailed_description: "Stable, high-strength woven fabric for structural composite applications.",
    image: { url: "/src/assets/fiberglass.jpg" },
    featured: false,
    sort_order: 2,
  },
  {
    slug: "unsaturated-polyester-resin",
    categorySlug: "resin-chemicals",
    name: "Unsaturated Polyester Resin",
    short_description: "General-purpose resin for FRP and marine use.",
    detailed_description: "High performance polyester resin for laminates, tanks, and panels.",
    image: { url: "/src/assets/resin.jpg" },
    featured: true,
    sort_order: 1,
  },
  {
    slug: "gelcoat-products",
    categorySlug: "resin-chemicals",
    name: "Gelcoat Products",
    short_description: "Protective surface finish for composites.",
    detailed_description: "Durable gelcoat products for a smooth, weather-resistant finish.",
    image: { url: "/src/assets/resin.jpg" },
    featured: false,
    sort_order: 2,
  },
  {
    slug: "sealant-tape",
    categorySlug: "vacuum-infusion",
    name: "Sealant Tape",
    short_description: "Sealing solution for vacuum bagging.",
    detailed_description: "Reliable sealant tape for infusion and vacuum layup processes.",
    image: { url: "/src/assets/vacuum.jpg" },
    featured: false,
    sort_order: 1,
  },
  {
    slug: "air-removal-rollers",
    categorySlug: "frp-accessories",
    name: "Air Removal Rollers",
    short_description: "Tooling roller for bubble-free laminates.",
    detailed_description: "Professional accessory for efficient air removal and clean finishing.",
    image: { url: "/src/assets/accessories.jpg" },
    featured: true,
    sort_order: 1,
  },
  {
    slug: "top-surface-sealer",
    categorySlug: "stone-care",
    name: "Top Surface Sealer",
    short_description: "Protective sealer for natural stone surfaces.",
    detailed_description: "Premium sealer designed for marble, granite, and polished stone.",
    image: { url: "/src/assets/stonecare.jpg" },
    featured: true,
    sort_order: 1,
  },
];

function base64Url(buffer) {
  return Buffer.from(buffer).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function hashPassword(password) {
  const iterations = 180000;
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `pbkdf2$${iterations}$${base64Url(salt)}$${base64Url(hash)}`;
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const users = db.collection("user_profiles");
  await users.updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        phone: null,
        passwordHash: hashPassword(adminPassword),
        role: "admin",
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );

  const categories = db.collection("categories");
  const products = db.collection("products");

  const insertedCategories = new Map();
  for (const entry of categorySeed) {
    const now = new Date().toISOString();
    const payload = {
      ...entry,
      name: entry.name,
      slug: entry.slug,
      createdAt: now,
      updatedAt: now,
    };
    const existing = await categories.findOneAndUpdate(
      { slug: entry.slug },
      { $set: payload },
      { upsert: true, returnDocument: "after" },
    );
    insertedCategories.set(entry.slug, existing._id.toString());
  }

  for (const entry of productSeed) {
    const categoryId = insertedCategories.get(entry.categorySlug);
    const now = new Date().toISOString();
    await products.findOneAndUpdate(
      { slug: entry.slug },
      {
        $set: {
          name: entry.name,
          slug: entry.slug,
          subtitle: null,
          category_id: categoryId,
          status: "published",
          featured: entry.featured,
          short_description: entry.short_description,
          detailed_description: entry.detailed_description,
          image: entry.image,
          og_image: entry.image,
          sort_order: entry.sort_order,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
  }

  const categoryCount = await categories.countDocuments();
  const productCount = await products.countDocuments({ status: "published" });
  console.log(JSON.stringify({ adminEmail, categoryCount, productCount }, null, 2));
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
