import { pbkdf2Sync, randomBytes } from "crypto";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, resolve } from "path";

const toolDir = dirname(fileURLToPath(import.meta.url));
const backendMongoModule = pathToFileURL(resolve(toolDir, "..", "Shravan_Backend", "node_modules", "mongodb", "lib", "index.js"));
const { MongoClient } = await import(backendMongoModule.href);

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/website-weaver-kit";
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "princesavaliya039@gmail.com";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Password123!";

const categorySeed = [
  {
    name: "FRP Raw Materials",
    slug: "frp-raw-materials",
    description:
      "High-quality FRP raw materials used in marble processing, reinforcement, fiber applications, filling work, and industrial resin systems.",
    image: "/src/assets/fiberglass.jpg",
    featured: true,
    sort_order: 1,
    products: [
      { name: "Fiber Glass 180 GSM", slug: "fiber-glass-180-gsm", featured: true },
      { name: "GP Resin A Grade Marble Filling", slug: "gp-resin-a-grade", featured: true },
      { name: "GP Resin B Grade Fiber Filling", slug: "gp-resin-b-grade" },
      { name: "Clear Cast Resin Filling", slug: "clear-cast-resin" },
      { name: "MEKP Hardener", slug: "mekp-hardener" },
      { name: "Pigment N-White", slug: "pigment-n-white" },
      { name: "Pigment Dark Cream", slug: "pigment-dark-cream" },
      { name: "Pigment D.A Gray", slug: "pigment-da-gray" },
      { name: "Pigment Beige Cream", slug: "pigment-beige-cream" },
      { name: "Pigment Light Cream", slug: "pigment-light-cream" },
      { name: "Fiber Net 80 GSM", slug: "fiber-net-80-gsm" },
      { name: "Cabosil Powder", slug: "cabosil-powder" },
      { name: "Mastic Solido Bainco White", slug: "mastic-solido-bainco" },
      { name: "Mastic Solido Cream", slug: "mastic-solido-cream" },
      { name: "Cobalt 3%", slug: "cobalt-3-percent" },
      { name: "Cobalt 6%", slug: "cobalt-6-percent" },
    ],
  },
  {
    name: "Vacuum Process Materials",
    slug: "vacuum-process-materials",
    description:
      "Industrial-grade vacuum process materials for marble block vacuum processing and reinforcement systems.",
    image: "/src/assets/vacuum.jpg",
    featured: false,
    sort_order: 2,
    products: [
      { name: "EWR 600 GSM Block Roving", slug: "ewr-600-gsm-block-roving", featured: true },
      { name: "Bonding Net Vacuum Net", slug: "bonding-net-vacuum-net" },
      { name: "Locking Tape", slug: "locking-tape" },
      { name: "Essay Spray Fevicol", slug: "essay-spray-fevicol" },
      { name: "Vacuum Plastic", slug: "vacuum-plastic", featured: true },
      { name: "Spiral Pipe 15mm", slug: "spiral-pipe-15mm" },
      { name: "Pipe 12x16", slug: "pipe-12x16" },
      { name: "Pipe 10x12", slug: "pipe-10x12" },
      { name: "Vacuum Clamp", slug: "vacuum-clamp" },
      { name: "Vacuum Tee", slug: "vacuum-tee" },
      { name: "Bosny Spray for Block Numbering", slug: "bosny-spray" },
    ],
  },
  {
    name: "Marble Block Reinforcement",
    slug: "marble-block-reinforcement",
    description:
      "Materials used for marble block reinforcement, gang saw processing, and structural support applications.",
    image: "/src/assets/marble-granite.jpg",
    featured: false,
    sort_order: 3,
    products: [
      { name: "Block Paste Part A Local", slug: "block-paste-part-a-local" },
      { name: "Block Paste Part B Local", slug: "block-paste-part-b-local" },
      { name: "Block Paste Part A Bond Tite", slug: "block-paste-part-a-bond-tite" },
      { name: "Block Paste Part B Bond Tite", slug: "block-paste-part-b-bond-tite" },
      { name: "Wooden Wool", slug: "wooden-wool" },
      { name: "POP Diamond", slug: "pop-diamond" },
    ],
  },
  {
    name: "Resin & Surface Filling Solutions",
    slug: "resin-surface-filling",
    description:
      "Advanced resin and surface filling solutions for crack filling, pinhole treatment, gloss enhancement, and marble finishing.",
    image: "/src/assets/resin.jpg",
    featured: false,
    sort_order: 4,
    products: [
      { name: "Bond Tite High Gloss Part A", slug: "bond-tite-high-gloss-part-a", featured: true },
      { name: "Bond Tite High Gloss Part B", slug: "bond-tite-high-gloss-part-b", featured: true },
      { name: "Top Sealer", slug: "top-sealer" },
      { name: "Clear Cast Resin", slug: "clear-cast-resin" },
      { name: "Wax Polish", slug: "wax-polish", featured: true },
    ],
  },
  {
    name: "Packing Materials",
    slug: "packing-materials",
    description:
      "Industrial packing and pallet protection materials for marble, stone slabs, and industrial logistics.",
    image: "/src/assets/accessories.jpg",
    featured: true,
    sort_order: 5,
    products: [
      { name: "Surface Protection Film", slug: "surface-protection-film" },
      { name: "Self Adhesive Sticker C1", slug: "self-adhesive-sticker-c1" },
      { name: "Thermocol Sheet", slug: "thermocol-sheet" },
      { name: "Air Bubble Roll", slug: "air-bubble-roll" },
      { name: "Packing Nails 4 Inch", slug: "packing-nails-4-inch" },
      { name: "Nails 3x10", slug: "nails-3x10" },
      { name: "Nails 2x12", slug: "nails-2x12" },
      { name: "Nails 4x8", slug: "nails-4x8" },
      { name: "Stretch Film", slug: "stretch-film" },
      { name: "2 Ply Corrugated Sheet", slug: "corrugated-sheet-2-ply" },
      { name: "Angle Edge Protector", slug: "angle-edge-protector" },
      { name: "EPE Foam C Type", slug: "epe-foam-c-type" },
      { name: "Masking Tape", slug: "masking-tape" },
      { name: "Brown Adhesive Tape", slug: "brown-adhesive-tape" },
      { name: "Transparent Adhesive Tape", slug: "transparent-adhesive-tape" },
      { name: "PET Strap Green Emboss", slug: "pet-strap-green-emboss" },
      { name: "Strapping Roll 9mm", slug: "strapping-roll-9mm" },
    ],
  },
  {
    name: "Water Treatment Chemicals",
    slug: "water-treatment-chemicals",
    description:
      "Industrial water treatment chemicals for clarification, decoloring, sludge treatment, filtration, and wastewater processing.",
    image: "/src/assets/hero-industrial.jpg",
    featured: true,
    sort_order: 6,
    products: [
      { name: "AF-820 Anionic PAM", slug: "af-820-anionic-pam", featured: true },
      { name: "HEXA PLUS Decoloring Agent", slug: "hexa-plus-decoloring-agent", featured: true },
      { name: "Flocculent", slug: "flocculent", featured: true },
      { name: "Filter Press Outer Inner", slug: "filter-press-outer-inner" },
      { name: "Pure Acetone", slug: "pure-acetone" },
    ],
  },
  {
    name: "Industrial Chemicals",
    slug: "industrial-chemicals",
    description:
      "Premium industrial-grade chemicals for manufacturing, coatings, cleaning, sealing, and process industries.",
    image: "/src/assets/hero-industrial.jpg",
    featured: true,
    sort_order: 7,
    products: [
      { name: "KONASIL K-D15 Fumed Silica", slug: "konasil-kd15-fumed-silica", featured: true },
      { name: "Cabosil Powder", slug: "cabosil-powder" },
      { name: "Waterproof Chemicals", slug: "waterproof-chemicals" },
      { name: "Acid", slug: "acid" },
      { name: "Solar Panel Cleaning Chemical Tetra TSPC", slug: "tetra-tspc" },
      { name: "Pigment Series", slug: "pigment-series" },
    ],
  },
  {
    name: "Safety Equipment",
    slug: "safety-equipment",
    description:
      "Industrial safety products for factory workers, plant safety, chemical handling, and maintenance operations.",
    image: "/src/assets/accessories.jpg",
    featured: true,
    sort_order: 8,
    products: [
      { name: "Cotton Hand Gloves", slug: "cotton-hand-gloves" },
      { name: "Surgical Hand Gloves", slug: "surgical-hand-gloves" },
      { name: "Yellow Safety Mask", slug: "yellow-safety-mask" },
      { name: "Yellow White Helmet", slug: "yellow-white-helmet" },
      { name: "PVC Apron 24x36", slug: "pvc-apron-24x36" },
      { name: "Cotton Rags", slug: "cotton-rags" },
    ],
  },
  {
    name: "Wire Rope & Lifting Solutions",
    slug: "wire-rope-lifting-solutions",
    description:
      "Heavy-duty lifting materials and gantry crane accessories for marble block handling and industrial lifting operations.",
    image: "/src/assets/hero-industrial.jpg",
    featured: true,
    sort_order: 9,
    products: [
      { name: "Gantry Wire Rope 25mm", slug: "gantry-wire-rope-25mm", featured: true },
      { name: "Usha Martin Wire Rope Sling", slug: "usha-martin-wire-rope-sling" },
      { name: "Wire Rope 16mm", slug: "wire-rope-16mm" },
      { name: "Belt Sealing 125mm x 5m", slug: "belt-sealing-125x5" },
      { name: "Belt Sealing 125mm x 6m", slug: "belt-sealing-125x6" },
      { name: "Belt Sleeve 1m", slug: "belt-sleeve-1m" },
    ],
  },
  {
    name: "Construction Materials",
    slug: "construction-materials",
    description:
      "Industrial and civil construction materials for infrastructure, factory maintenance, waterproofing, and ceiling systems.",
    image: "/src/assets/marble-granite.jpg",
    featured: false,
    sort_order: 10,
    products: [
      { name: "Cement", slug: "cement" },
      { name: "Bricks", slug: "bricks" },
      { name: "White Sand", slug: "white-sand" },
      { name: "Epoxy Paint", slug: "epoxy-paint" },
      { name: "Oil Paint", slug: "oil-paint" },
      { name: "White Putty", slug: "white-putty" },
      { name: "Waterproof Chemicals", slug: "waterproof-chemicals" },
      { name: "Gypsum Board", slug: "gypsum-board" },
      { name: "Cement Board", slug: "cement-board" },
      { name: "FRP Bathroom Door", slug: "frp-bathroom-door" },
    ],
  },
  {
    name: "Industrial Tools & Finishing Products",
    slug: "industrial-tools-finishing",
    description:
      "Professional industrial tools and finishing materials for polishing, engraving, edge finishing, and maintenance operations.",
    image: "/src/assets/accessories.jpg",
    featured: false,
    sort_order: 11,
    products: [
      { name: "Engraving Cutting Tool 10mm", slug: "engraving-cutting-tool-10mm" },
      { name: "Abrasive Spongy Wheel", slug: "abrasive-spongy-wheel" },
      { name: "Wax Polish", slug: "wax-polish" },
      { name: "Tetra TSPC Cleaning Chemical", slug: "tetra-tspc-cleaning-chemical" },
    ],
  },
  {
    name: "Industrial Services",
    slug: "industrial-services",
    description:
      "Industrial maintenance, fabrication, ceiling systems, and infrastructure support services.",
    image: "/src/assets/hero-industrial.jpg",
    featured: false,
    sort_order: 12,
    products: [
      { name: "Pre Monsoon Industrial Maintenance", slug: "pre-monsoon-industrial-maintenance" },
      { name: "Roofing Sheet Replacement", slug: "roofing-sheet-replacement" },
      { name: "Air Ventilator Fan Replacement", slug: "air-ventilator-fan-replacement" },
      { name: "Aluminum Cabin Work", slug: "aluminum-cabin-work" },
      { name: "Aluminum Window Work", slug: "aluminum-window-work" },
      { name: "GI Suspended Ceiling", slug: "gi-suspended-ceiling" },
      { name: "Partition System Work", slug: "partition-system-work" },
    ],
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

  // remove previous test data
  await Promise.all([categories.deleteMany({}), products.deleteMany({})]);

  const now = new Date().toISOString();
  const insertedCategories = new Map();
  const categoryDocs = categorySeed.map((entry) => ({
    name: entry.name,
    slug: entry.slug,
    description: entry.description,
    short_description: entry.description,
    banner_image: { url: entry.image },
    image: { url: entry.image },
    status: "active",
    is_visible: true,
    featured: Boolean(entry.featured),
    sort_order: entry.sort_order,
    createdAt: now,
    updatedAt: now,
  }));

  const categoryInsertResult = await categories.insertMany(categoryDocs);
  categorySeed.forEach((entry, index) => {
    insertedCategories.set(entry.slug, categoryInsertResult.insertedIds[index].toString());
  });

  const productDocs = categorySeed.flatMap((category) =>
    category.products.map((product, productIndex) => {
      const imageUrl = category.image;
      return {
        name: product.name,
        slug: product.slug,
        subtitle: null,
        category_id: insertedCategories.get(category.slug),
        category_slug: category.slug,
        status: "published",
        featured: Boolean(product.featured),
        short_description: product.short_description ?? `${product.name} designed for ${category.name.toLowerCase()} applications.`,
        detailed_description:
          product.detailed_description ?? `High-quality ${product.name.toLowerCase()} for ${category.name.toLowerCase()} workflows and industrial use.`,
        image: { url: imageUrl },
        og_image: { url: imageUrl },
        sort_order: product.sort_order ?? productIndex + 1,
        createdAt: now,
        updatedAt: now,
      };
    }),
  );

  await products.insertMany(productDocs);

  const categoryCount = await categories.countDocuments();
  const productCount = await products.countDocuments({ status: "published" });
  console.log(JSON.stringify({ adminEmail, categoryCount, productCount, reset: true }, null, 2));
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
