#!/usr/bin/env node
/**
 * Shravan Enterprises - Fix Unassigned Categories for Image Products (.cjs)
 *
 * Use this AFTER running seed_remaining_image_products.cjs.
 *
 * What this script does:
 * - Creates missing image categories if needed.
 * - Finds every product from the uploaded image list.
 * - Forces the correct category assignment on those products.
 * - Repairs product/category relation fields used by different admin panels:
 *   categoryId, category, categoryRef, categoryName, categorySlug,
 *   category_id, categoryIdString, category_id_string.
 * - Repairs category product links:
 *   products, productIds, productIdStrings, productSlugs, productCount.
 *
 * Same credential/env style as your previous copied seed file:
 *   MONGODB_URI
 *   CATEGORY_COLLECTION
 *   PRODUCT_COLLECTION
 *
 * Safe default:
 *   mongodb://127.0.0.1:27017/website-weaver-kit
 */

try {
  require("dotenv").config();
} catch (error) {
  // dotenv is optional. The script also works with normal process.env.
}

const { MongoClient } = require("mongodb");

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/website-weaver-kit";

const CATEGORY_COLLECTION = process.env.CATEGORY_COLLECTION ?? "categories";
const PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION ?? "products";

const SEED_KEY = "shravan-enterprises-image-category-repair-seed";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(value) {
  return normalizeText(value).replace(/\s+/g, "-");
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getIdString(id) {
  return id ? String(id) : "";
}

function inferGrade(productName) {
  const name = String(productName || "");
  const parts = [];

  const paMatch = name.match(/\((PA\d+)\)/i);
  if (paMatch) parts.push(paMatch[1].toUpperCase());

  if (/Green/i.test(name)) parts.push("Green");

  const gsmMatch = name.match(/(\d+\s*GSM)/i);
  if (gsmMatch) parts.push(gsmMatch[1].replace(/\s+/g, " ").toUpperCase());

  if (/Low Temperature/i.test(name)) parts.push("Low Temperature");
  if (/High Temp/i.test(name)) parts.push("High Temp");

  if (/Non Perforated/i.test(name)) {
    parts.push("Non Perforated");
  } else if (/Perforated/i.test(name)) {
    parts.push("Perforated");
  }

  return parts.length ? parts.join(" / ") : "Standard";
}

const categoryDescriptions = {
  Films:
    "Vacuum bagging and release films for composite, FRP and vacuum infusion process work.",
  Tapes:
    "Industrial tapes used for masking, bonding, sealing and vacuum bagging support applications.",
  "Vap Membrane":
    "Vap membrane products for vacuum infusion, composite processing and controlled resin flow work.",
  "Peel Ply":
    "Peel ply fabrics used for surface preparation, resin control and composite laminate processing.",
  "Pipe & Profile":
    "Hose pipes, spiral tubes and profiles used for resin feed, vacuum line and infusion setup.",
  "Flow Media":
    "Flow media and infusion mesh products used to improve resin distribution during vacuum infusion.",
  "Paint Rollers & Ancillaries":
    "Paint rollers, trays and accessories for coating, resin application and surface finishing work.",
  "Breather Fabric":
    "Breather fabric materials used for air evacuation, vacuum bagging and composite processing.",
  Fittings:
    "Connectors, clamps, inlet ports and valves for resin inlet, vacuum line and infusion systems.",
  "Other Consumables":
    "Additional consumables used in composite, FRP, vacuum infusion and industrial production work.",
};

const categoryUnits = {
  Films: "Roll",
  Tapes: "Roll",
  "Vap Membrane": "Roll",
  "Peel Ply": "Roll",
  "Pipe & Profile": "Mtr",
  "Flow Media": "Roll",
  "Paint Rollers & Ancillaries": "Nos",
  "Breather Fabric": "Roll",
  Fittings: "Nos",
  "Other Consumables": "Nos",
};

const imageProductGroups = [
  {
    category: "Films",
    products: [
      "Vacuum Bagging Film",
      "Perforated Release Film",
      "Non Perforated Release Film",
    ],
  },
  {
    category: "Tapes",
    products: [
      "Double Adhesive Tape",
      "Masking Tape",
      "PTFE Teflon Tape",
      "Sealant Tape – Low Temperature",
      "Sealant tape – High Temp",
    ],
  },
  {
    category: "Vap Membrane",
    products: ["Vap Membrane 120 GSM", "Vap Membrane 160 GSM"],
  },
  {
    category: "Peel Ply",
    products: [
      "Polyester Peel Ply",
      "Nylon Peel Ply (PA66) – 105 GSM",
      "Nylon Peel Ply (PA66) – 90 GSM",
      "Nylon Peel Ply (PA6) – 105 GSM",
      "Nylon Peel Ply (PA6) – 85 GSM",
    ],
  },
  {
    category: "Pipe & Profile",
    products: [
      "Feed Hose Pipe",
      "Nylon Braided Hose Pipe",
      "Nylon Transparent Hose Pipe",
      "Omega Profile",
      "PVC Steel Wire Hose Pipe/ PVC Spring Hose Pipe",
      "Spiral Tubes",
    ],
  },
  {
    category: "Flow Media",
    products: [
      "Infusion Mesh – Green 160 GSM",
      "Infusion Mesh – Green 180 GSM",
      "Knitted Infusion Mesh 125 GSM",
      "Knitted Infusion Mesh 140 GSM",
      "Knitted Infusion Mesh 160 GSM",
    ],
  },
  {
    category: "Paint Rollers & Ancillaries",
    products: [
      "Foam Roller",
      "Fur Roller / Fabric Roller",
      "Mohair Roller",
      "Paint Tray",
      "Velour Roller",
      "Wooster Roller",
    ],
  },
  {
    category: "Breather Fabric",
    products: [
      "Breather Fabric 130 GSM",
      "Breather Fabric 150 GSM",
      "Breather Fabric 350 GSM",
    ],
  },
  {
    category: "Fittings",
    products: [
      "Hose Clamp",
      "L Connector",
      "Resin Inlet Port",
      "Straight Connector",
      "T Connector",
      "Vacuum Inlet Port",
      "Vacuum Valve",
    ],
  },
  {
    category: "Other Consumables",
    products: ["Axle Net", "Extension Pole", "Perforated Plate"],
  },
];

const categorySeedData = imageProductGroups.map((group, index) => {
  const slug = slugify(group.category);
  const description =
    categoryDescriptions[group.category] ||
    `Products for ${group.category.toLowerCase()} applications.`;

  return {
    code: `IMG-${String(index + 1).padStart(2, "0")}`,
    name: group.category,
    slug,
    parentCategory: null,
    shortDescription: description,
    longDescription: description,
    description,
    seoTitle: `${group.category} | Shravan Enterprises`,
    seoDescription: `${description} Supplied by Shravan Enterprises.`,
    status: "active",
    isActive: true,
    sortOrder: index + 100,
    bannerImage: `${slug}.jpg`,
    categoryBannerImage: `${slug}.jpg`,
    icon: `${slug}-icon`,
    categoryIcon: `${slug}-icon`,
    source: {
      document: "Uploaded image product list",
      page: "image",
      originalCategory: group.category,
    },
  };
});

function buildProductSeed(productName, categoryName, sortOrder) {
  const categorySlug = slugify(categoryName);
  const slug = slugify(productName);
  const unit = categoryUnits[categoryName] || "Nos";
  const grade = inferGrade(productName);

  return {
    pdfSrNo: `IMG-FIX-${sortOrder}`,
    name: productName,
    title: productName,
    productName,
    slug,
    categoryName,
    categorySlug,
    typeGrade: grade,
    type: grade,
    grade,
    shortLine: `For ${categoryName.toLowerCase()} requirements.`,
    shortDescription: `${productName} is supplied for ${categoryName.toLowerCase()} applications. It is suitable for FRP, composite, vacuum infusion, resin process and industrial production requirements.`,
    description: `Shravan Enterprises supplies ${productName} under the ${categoryName} category. This product is mainly used for ${categoryName.toLowerCase()} applications and helps support reliable workflow in FRP, composite, vacuum infusion, resin handling, surface finishing and related industrial work. Available unit: ${unit}.`,
    detailedDescription: `Shravan Enterprises supplies ${productName} under the ${categoryName} category. This product is mainly used for ${categoryName.toLowerCase()} applications and helps support reliable workflow in FRP, composite, vacuum infusion, resin handling, surface finishing and related industrial work. Available unit: ${unit}.`,
    applicationsSummary: `Main application: ${categoryName}. Best suited for FRP work, composite processing, vacuum infusion, resin application and industrial users.`,
    industriesServed: [
      "FRP & composite processing",
      "Vacuum infusion",
      "Resin application",
      "Industrial production",
      "Surface finishing",
    ],
    keyFeatures: [
      "Reliable supply quality",
      `Suitable for ${categoryName} applications`,
      "Easy to use in daily production",
      "Supports consistent process output",
      `Unit tracked as ${unit}`,
    ],
    technicalSummary: `${productName} | Category: ${categoryName} | UOM: ${unit} | Grade/Type: ${grade}`,
    unit,
    uom: unit,
    moq: "As per requirement",
    packingSize: "",
    status: "published",
    isPublished: true,
    featured: false,
    isFeatured: false,
    sortOrder,
    mainProductImage: `${slug}.jpg`,
    mainImage: `${slug}.jpg`,
    image: `${slug}.jpg`,
    images: [`${slug}.jpg`],
    applicationRows: [
      {
        title: categoryName,
        detail: `Main application: ${categoryName}. Best suited for FRP work, composite processing, vacuum infusion, resin application and industrial users.`,
        sourcePdfApplication: categoryName,
      },
    ],
    technicalRows: [
      {
        label: "Unit of measurement",
        value: unit,
      },
      {
        label: "Category",
        value: categoryName,
      },
      {
        label: "Grade / Type",
        value: grade,
      },
      {
        label: "Main application",
        value: categoryName,
      },
    ],
    source: {
      document: "Uploaded image product list",
      page: "image",
      pdfApplication: categoryName,
      reviewNote:
        "Category repaired from uploaded image product list. Verify product image later.",
    },
  };
}

function getProductSeedList() {
  let sortOrder = 1000;
  const list = [];

  for (const group of imageProductGroups) {
    for (const productName of group.products) {
      sortOrder += 1;
      list.push(buildProductSeed(productName, group.category, sortOrder));
    }
  }

  return list;
}

function productFindQuery(product) {
  const name = product.name || product.productName || product.title;
  const nameKey = normalizeText(name);
  const slug = product.slug || slugify(name);

  return {
    $or: [
      { slug },
      { nameKey },
      { productNameKey: nameKey },
      { name: new RegExp(`^${escapeRegex(name)}$`, "i") },
      { productName: new RegExp(`^${escapeRegex(name)}$`, "i") },
      { title: new RegExp(`^${escapeRegex(name)}$`, "i") },
    ],
  };
}

async function safeCreateIndex(collection, index) {
  try {
    await collection.createIndex(index);
  } catch (error) {
    console.warn("Index skipped:", JSON.stringify(index), error.message);
  }
}

async function upsertCategory(categoryCollection, category) {
  const now = new Date();
  const nameKey = normalizeText(category.name);

  const existing = await categoryCollection.findOne({
    $or: [{ slug: category.slug }, { nameKey }],
  });

  const updateDoc = {
    ...category,
    nameKey,
    seedKey: SEED_KEY,
    updatedAt: now,
  };

  if (existing && existing._id) {
    await categoryCollection.updateOne(
      { _id: existing._id },
      {
        $set: updateDoc,
        $setOnInsert: { createdAt: now },
      }
    );

    return { ...existing, ...updateDoc, _id: existing._id };
  }

  const result = await categoryCollection.insertOne({
    ...updateDoc,
    createdAt: now,
  });

  return { ...updateDoc, _id: result.insertedId };
}

function buildCategoryAssignmentUpdate(product, categoryDoc) {
  const now = new Date();
  const name = product.name || product.productName || product.title;
  const nameKey = normalizeText(name);
  const categoryNameKey = normalizeText(categoryDoc.name);
  const categoryIdString = getIdString(categoryDoc._id);

  return {
    ...product,

    name,
    title: product.title || name,
    productName: product.productName || name,

    nameKey,
    productNameKey: nameKey,

    categoryId: categoryDoc._id,
    category: categoryDoc._id,
    categoryRef: categoryDoc._id,
    category_id: categoryDoc._id,

    categoryIdString,
    category_id_string: categoryIdString,

    categoryName: categoryDoc.name,
    categoryTitle: categoryDoc.name,
    categorySlug: categoryDoc.slug,
    categoryNameKey,

    duplicateKey: `${nameKey}::${categoryNameKey}`,

    metaTitle: product.seoTitle || product.title || name,
    metaDescription: product.seoDescription || product.shortDescription || "",

    seedKey: SEED_KEY,
    updatedAt: now,
  };
}

async function forceAssignProduct(productCollection, product, categoryDoc) {
  const now = new Date();
  const found = await productCollection.findOne(productFindQuery(product));
  const updateDoc = buildCategoryAssignmentUpdate(product, categoryDoc);

  if (found && found._id) {
    await productCollection.updateOne(
      { _id: found._id },
      {
        $set: updateDoc,
        $setOnInsert: { createdAt: now },
      }
    );

    return {
      _id: found._id,
      slug: updateDoc.slug,
      name: updateDoc.name,
      categoryName: categoryDoc.name,
      action: "updated-category",
    };
  }

  const inserted = await productCollection.insertOne({
    ...updateDoc,
    createdAt: now,
  });

  return {
    _id: inserted.insertedId,
    slug: updateDoc.slug,
    name: updateDoc.name,
    categoryName: categoryDoc.name,
    action: "inserted-missing-product",
  };
}

async function repairCategoryLinks(categoryCollection, categoryDoc, productResults) {
  const existing = await categoryCollection.findOne({ _id: categoryDoc._id });

  const oldProductIds = Array.isArray(existing && existing.productIds)
    ? existing.productIds
    : [];

  const oldProducts = Array.isArray(existing && existing.products)
    ? existing.products
    : [];

  const oldProductIdStrings = Array.isArray(existing && existing.productIdStrings)
    ? existing.productIdStrings
    : [];

  const oldProductSlugs = Array.isArray(existing && existing.productSlugs)
    ? existing.productSlugs
    : [];

  const mergedIdMap = new Map();

  for (const id of oldProductIds) {
    const key = getIdString(id);
    if (key) mergedIdMap.set(key, id);
  }

  for (const id of oldProducts) {
    const key = getIdString(id);
    if (key) mergedIdMap.set(key, id);
  }

  for (const item of productResults) {
    const key = getIdString(item._id);
    if (key) mergedIdMap.set(key, item._id);
  }

  const mergedProductIds = Array.from(mergedIdMap.values());

  const mergedProductIdStrings = Array.from(
    new Set(
      [
        ...oldProductIdStrings.map(String),
        ...mergedProductIds.map(getIdString),
      ].filter(Boolean)
    )
  );

  const mergedProductSlugs = Array.from(
    new Set(
      [
        ...oldProductSlugs.map(String),
        ...productResults.map((item) => item.slug),
      ].filter(Boolean)
    )
  );

  await categoryCollection.updateOne(
    { _id: categoryDoc._id },
    {
      $set: {
        productCount: mergedProductIdStrings.length,
        productIds: mergedProductIds,
        products: mergedProductIds,
        productIdStrings: mergedProductIdStrings,
        productSlugs: mergedProductSlugs,
        updatedAt: new Date(),
      },
    }
  );
}

async function seed() {
  const connection = await MongoClient.connect(MONGODB_URI);
  const db = connection.db();

  const categoryCollection = db.collection(CATEGORY_COLLECTION);
  const productCollection = db.collection(PRODUCT_COLLECTION);

  await safeCreateIndex(categoryCollection, { slug: 1 });
  await safeCreateIndex(categoryCollection, { nameKey: 1 });
  await safeCreateIndex(categoryCollection, { seedKey: 1 });

  await safeCreateIndex(productCollection, { slug: 1 });
  await safeCreateIndex(productCollection, { nameKey: 1 });
  await safeCreateIndex(productCollection, { productNameKey: 1 });
  await safeCreateIndex(productCollection, { categoryId: 1 });
  await safeCreateIndex(productCollection, { category: 1 });
  await safeCreateIndex(productCollection, { categorySlug: 1 });
  await safeCreateIndex(productCollection, { categoryNameKey: 1 });
  await safeCreateIndex(productCollection, { duplicateKey: 1 });
  await safeCreateIndex(productCollection, { seedKey: 1 });

  const categoryByName = new Map();

  for (const category of categorySeedData) {
    const categoryDoc = await upsertCategory(categoryCollection, category);
    categoryByName.set(category.name, categoryDoc);
  }

  const products = getProductSeedList();

  let updatedProducts = 0;
  let insertedProducts = 0;

  const resultsByCategory = new Map();

  for (const product of products) {
    const categoryDoc = categoryByName.get(product.categoryName);

    if (!categoryDoc || !categoryDoc._id) {
      console.warn(`Category missing: ${product.categoryName}`);
      continue;
    }

    const result = await forceAssignProduct(productCollection, product, categoryDoc);

    if (result.action === "inserted-missing-product") insertedProducts += 1;
    else updatedProducts += 1;

    const categoryKey = getIdString(categoryDoc._id);

    if (!resultsByCategory.has(categoryKey)) {
      resultsByCategory.set(categoryKey, {
        categoryDoc,
        products: [],
      });
    }

    resultsByCategory.get(categoryKey).products.push(result);

    console.log(`${result.action}: ${result.name} -> ${result.categoryName}`);
  }

  let repairedCategories = 0;

  for (const payload of resultsByCategory.values()) {
    await repairCategoryLinks(
      categoryCollection,
      payload.categoryDoc,
      payload.products
    );
    repairedCategories += 1;
  }

  await connection.close();

  console.log("");
  console.log("Category repair completed successfully.");
  console.log(`Products updated with category: ${updatedProducts}`);
  console.log(`Missing products inserted: ${insertedProducts}`);
  console.log(`Categories repaired: ${repairedCategories}`);
  console.log("");
  console.log("Now restart backend and refresh admin panel.");
}

seed().catch((error) => {
  console.error("Category repair failed:", error.message);
  console.error(error.stack);
  process.exit(1);
});
