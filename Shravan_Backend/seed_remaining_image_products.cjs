#!/usr/bin/env node
/**
 * Shravan Enterprises - Remaining Image Products Seed Script (.cjs)
 *
 * This script seeds ONLY the remaining products from the uploaded image.
 *
 * Excluded because it already exists in your previous copied seed list:
 * - Masking Tape
 *
 * Same credential/env style as your previous seed file:
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

const SEED_KEY = "shravan-enterprises-image-remaining-products-seed";

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

const categories = imageProductGroups.map((group, index) => {
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

let globalSortOrder = 1000;

const products = imageProductGroups.flatMap((group) => {
  const categorySlug = slugify(group.category);
  const unit = categoryUnits[group.category] || "Nos";

  return group.products.map((productName) => {
    const slug = slugify(productName);
    const grade = inferGrade(productName);
    globalSortOrder += 1;

    return {
      pdfSrNo: `IMG-${globalSortOrder}`,
      name: productName,
      title: productName,
      productName,
      slug,
      categoryName: group.category,
      categorySlug,
      typeGrade: grade,
      type: grade,
      grade,
      shortLine: `For ${group.category.toLowerCase()} requirements.`,
      shortDescription: `${productName} is supplied for ${group.category.toLowerCase()} applications. It is suitable for FRP, composite, vacuum infusion, resin process and industrial production requirements.`,
      description: `Shravan Enterprises supplies ${productName} under the ${group.category} category. This product is mainly used for ${group.category.toLowerCase()} applications and helps support reliable workflow in FRP, composite, vacuum infusion, resin handling, surface finishing and related industrial work. Available unit: ${unit}.`,
      detailedDescription: `Shravan Enterprises supplies ${productName} under the ${group.category} category. This product is mainly used for ${group.category.toLowerCase()} applications and helps support reliable workflow in FRP, composite, vacuum infusion, resin handling, surface finishing and related industrial work. Available unit: ${unit}.`,
      applicationsSummary: `Main application: ${group.category}. Best suited for FRP work, composite processing, vacuum infusion, resin application and industrial users.`,
      industriesServed: [
        "FRP & composite processing",
        "Vacuum infusion",
        "Resin application",
        "Industrial production",
        "Surface finishing",
      ],
      keyFeatures: [
        "Reliable supply quality",
        `Suitable for ${group.category} applications`,
        "Easy to use in daily production",
        "Supports consistent process output",
        `Unit tracked as ${unit}`,
      ],
      technicalSummary: `${productName} | Category: ${group.category} | UOM: ${unit} | Grade/Type: ${grade}`,
      unit,
      uom: unit,
      moq: "As per requirement",
      packingSize: "",
      status: "published",
      isPublished: true,
      featured: false,
      isFeatured: false,
      sortOrder: globalSortOrder,
      mainProductImage: `${slug}.jpg`,
      mainImage: `${slug}.jpg`,
      image: `${slug}.jpg`,
      images: [`${slug}.jpg`],
      applicationRows: [
        {
          title: group.category,
          detail: `Main application: ${group.category}. Best suited for FRP work, composite processing, vacuum infusion, resin application and industrial users.`,
          sourcePdfApplication: group.category,
        },
      ],
      technicalRows: [
        {
          label: "Unit of measurement",
          value: unit,
        },
        {
          label: "Category",
          value: group.category,
        },
        {
          label: "Grade / Type",
          value: grade,
        },
        {
          label: "Main application",
          value: group.category,
        },
      ],
      source: {
        document: "Uploaded image product list",
        page: "image",
        pdfApplication: group.category,
        reviewNote:
          "Seeded from uploaded image product list. Verify product image later.",
      },
    };
  });
});

function getProductName(product) {
  return product.name || product.productName || product.title || "";
}

function buildCategoryDoc(category, now) {
  const nameKey = normalizeText(category.name);

  return {
    ...category,
    nameKey,
    seedKey: SEED_KEY,
    updatedAt: now,
  };
}

function buildProductDoc(product, categoryDoc, now) {
  const name = getProductName(product);
  const nameKey = normalizeText(name);
  const categoryNameKey = normalizeText(categoryDoc.name);
  const duplicateKey = `${nameKey}::${categoryNameKey}`;

  return {
    ...product,

    name,
    title: product.title || name,
    productName: product.productName || name,

    nameKey,
    productNameKey: nameKey,
    categoryNameKey,
    duplicateKey,

    categoryId: categoryDoc._id,
    category: categoryDoc._id,
    categoryRef: categoryDoc._id,
    categoryName: categoryDoc.name,
    categorySlug: categoryDoc.slug,

    metaTitle: product.seoTitle || product.title || name,
    metaDescription: product.seoDescription || product.shortDescription || "",

    seedKey: SEED_KEY,
    updatedAt: now,
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
  const doc = buildCategoryDoc(category, now);

  const existing = await categoryCollection.findOne({
    $or: [{ slug: category.slug }, { nameKey: normalizeText(category.name) }],
  });

  if (existing && existing._id) {
    await categoryCollection.updateOne({ _id: existing._id }, { $set: doc });

    return {
      id: existing._id,
      doc: { ...doc, _id: existing._id },
      inserted: false,
    };
  }

  const result = await categoryCollection.insertOne({
    ...doc,
    createdAt: now,
  });

  return {
    id: result.insertedId,
    doc: { ...doc, _id: result.insertedId },
    inserted: true,
  };
}

async function upsertProduct(productCollection, product, categoryDoc) {
  const now = new Date();
  const name = getProductName(product);
  const nameKey = normalizeText(name);
  const categoryNameKey = normalizeText(categoryDoc.name);
  const duplicateKey = `${nameKey}::${categoryNameKey}`;

  const sameCategoryExisting = await productCollection.findOne({
    $or: [
      { duplicateKey },
      { slug: product.slug, categoryNameKey },
      { nameKey, categoryNameKey },
    ],
  });

  const doc = buildProductDoc(product, categoryDoc, now);

  if (sameCategoryExisting && sameCategoryExisting._id) {
    await productCollection.updateOne(
      { _id: sameCategoryExisting._id },
      { $set: doc }
    );

    return {
      id: sameCategoryExisting._id,
      doc: { ...doc, _id: sameCategoryExisting._id },
      inserted: false,
      skipped: false,
    };
  }

  const sameNameExisting = await productCollection.findOne({
    $or: [
      { nameKey },
      { productNameKey: nameKey },
      { name: new RegExp(`^${escapeRegex(name)}$`, "i") },
      { productName: new RegExp(`^${escapeRegex(name)}$`, "i") },
      { title: new RegExp(`^${escapeRegex(name)}$`, "i") },
    ],
  });

  if (sameNameExisting && sameNameExisting._id) {
    return {
      id: sameNameExisting._id,
      doc: sameNameExisting,
      inserted: false,
      skipped: true,
      skippedReason: "Product name already exists in database",
    };
  }

  try {
    const result = await productCollection.insertOne({
      ...doc,
      createdAt: now,
    });

    return {
      id: result.insertedId,
      doc: { ...doc, _id: result.insertedId },
      inserted: true,
      skipped: false,
    };
  } catch (error) {
    if (error && error.code === 11000 && product.slug) {
      const slugMatch = await productCollection.findOne({ slug: product.slug });

      if (slugMatch && slugMatch._id) {
        await productCollection.updateOne(
          { _id: slugMatch._id },
          { $set: doc }
        );

        return {
          id: slugMatch._id,
          doc: { ...doc, _id: slugMatch._id },
          inserted: false,
          skipped: false,
          duplicateSlugRecovered: true,
        };
      }
    }

    throw error;
  }
}

async function attachProductsToCategories(categoryCollection, categoryToProductIds) {
  let updated = 0;

  for (const payload of categoryToProductIds.values()) {
    const { categoryId, productIds, productIdStrings, productSlugs } = payload;

    const existing = await categoryCollection.findOne({ _id: categoryId });

    const oldProductIds = Array.isArray(existing && existing.productIds)
      ? existing.productIds
      : [];

    const oldProductIdStrings = Array.isArray(
      existing && existing.productIdStrings
    )
      ? existing.productIdStrings
      : [];

    const oldProducts = Array.isArray(existing && existing.products)
      ? existing.products
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

    for (const id of productIds) {
      const key = getIdString(id);
      if (key) mergedIdMap.set(key, id);
    }

    const mergedProductIds = Array.from(mergedIdMap.values());

    const mergedProductIdStrings = Array.from(
      new Set(
        [
          ...oldProductIdStrings.map(String),
          ...mergedProductIds.map(getIdString),
          ...productIdStrings.map(String),
        ].filter(Boolean)
      )
    );

    const mergedProductSlugs = Array.from(
      new Set(
        [...oldProductSlugs.map(String), ...productSlugs.map(String)].filter(
          Boolean
        )
      )
    );

    await categoryCollection.updateOne(
      { _id: categoryId },
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

    updated += 1;
  }

  return updated;
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
  await safeCreateIndex(productCollection, { nameKey: 1, categoryNameKey: 1 });
  await safeCreateIndex(productCollection, { duplicateKey: 1 });
  await safeCreateIndex(productCollection, { categorySlug: 1 });
  await safeCreateIndex(productCollection, { categoryId: 1 });
  await safeCreateIndex(productCollection, { seedKey: 1 });

  const categoryBySlug = new Map();
  const categoryByName = new Map();
  const categoryToProductIds = new Map();

  let insertedCategories = 0;
  let updatedCategories = 0;

  for (const category of categories) {
    const result = await upsertCategory(categoryCollection, category);

    if (result.inserted) insertedCategories += 1;
    else updatedCategories += 1;

    categoryBySlug.set(result.doc.slug, result.doc);
    categoryByName.set(result.doc.name, result.doc);
  }

  let insertedProducts = 0;
  let updatedProducts = 0;
  let skippedProducts = 0;
  let recoveredFromSlugConflicts = 0;

  for (const product of products) {
    const categoryDoc =
      categoryBySlug.get(product.categorySlug) ||
      categoryByName.get(product.categoryName) ||
      categoryBySlug.get(slugify(product.categoryName));

    if (!categoryDoc || !categoryDoc._id) {
      console.warn(
        `Category not found for product: ${getProductName(product)} (${product.categoryName})`
      );
      continue;
    }

    const result = await upsertProduct(productCollection, product, categoryDoc);

    if (result.skipped) {
      skippedProducts += 1;
      console.log(`Skipped existing product: ${getProductName(product)}`);
      continue;
    }

    if (result.inserted) insertedProducts += 1;
    else updatedProducts += 1;

    if (result.duplicateSlugRecovered) recoveredFromSlugConflicts += 1;

    const categoryIdString = getIdString(categoryDoc._id);

    if (!categoryToProductIds.has(categoryIdString)) {
      categoryToProductIds.set(categoryIdString, {
        categoryId: categoryDoc._id,
        productIds: [],
        productIdStrings: [],
        productSlugs: [],
      });
    }

    const bucket = categoryToProductIds.get(categoryIdString);

    bucket.productIds.push(result.id);
    bucket.productIdStrings.push(getIdString(result.id));
    bucket.productSlugs.push(result.doc.slug);
  }

  const linkedCategories = await attachProductsToCategories(
    categoryCollection,
    categoryToProductIds
  );

  await connection.close();

  console.log("Remaining image products seed completed successfully.");
  console.log(
    `Categories: ${insertedCategories} inserted, ${updatedCategories} updated`
  );
  console.log(`Products: ${insertedProducts} inserted, ${updatedProducts} updated`);
  console.log(`Skipped existing products: ${skippedProducts}`);
  console.log(`Category links repaired: ${linkedCategories} categories updated`);

  if (recoveredFromSlugConflicts) {
    console.log(
      `Recovered from existing slug conflicts: ${recoveredFromSlugConflicts}`
    );
  }

  console.log("Now restart your backend and refresh admin panel.");
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  console.error(error.stack);
  process.exit(1);
});
