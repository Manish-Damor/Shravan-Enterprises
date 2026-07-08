#!/usr/bin/env node
/**
 * Shravan Enterprises MongoDB Seed Script
 *
 * What this script does:
 * - Seeds all PDF categories and products into MongoDB.
 * - Does not import or change your existing app logic.
 * - Uses only direct MongoDB collection writes.
 * - Removes duplicate records from the seed input by: product name + category.
 * - Prevents duplicate DB inserts by checking existing products using: product name + category.
 *
 * Required env:
 *   MONGODB_URI
 *
 * Safe default used when MONGODB_URI is missing:
 *   mongodb://127.0.0.1:27017/website-weaver-kit
 *
 * Optional env:
 *   CATEGORY_COLLECTION=categories
 *   PRODUCT_COLLECTION=products
 */

try {
  require("dotenv").config();
} catch (error) {
  // dotenv is optional. The script also works with normal process.env.
}

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/website-weaver-kit";
const CATEGORY_COLLECTION = process.env.CATEGORY_COLLECTION ?? "categories";
const PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION ?? "products";
const SEED_KEY = "shravan-enterprises-pdf-seed";

const categories = [
  {
    "code": "A",
    "name": "Manual Fiber Process Materials",
    "slug": "manual-fiber-process-materials",
    "parentCategory": null,
    "shortDescription": "FRP and marble filling raw materials for manual fiber and filling work.",
    "longDescription": "A complete range of manual fiber process materials including fiberglass, resin, hardener, pigment, mesh, mastic, cabosil and cobalt for marble stone and FRP filling applications.",
    "description": "A complete range of manual fiber process materials including fiberglass, resin, hardener, pigment, mesh, mastic, cabosil and cobalt for marble stone and FRP filling applications.",
    "seoTitle": "Manual Fiber Process Materials | Shravan Enterprises",
    "seoDescription": "Manual fiber and filling raw materials for marble, stone and FRP applications. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 1,
    "bannerImage": "manual-fiber-process.jpg",
    "categoryBannerImage": "manual-fiber-process.jpg",
    "icon": "fiber-roll-icon",
    "categoryIcon": "fiber-roll-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "originalCategory": "Supply of Materials for Manual Fiber process"
    }
  },
  {
    "code": "B",
    "name": "Block Vacuum Process Materials",
    "slug": "block-vacuum-process-materials",
    "parentCategory": null,
    "shortDescription": "Vacuum process consumables and accessories for marble block reinforcement.",
    "longDescription": "Block vacuum process materials used for marble block preparation, vacuum netting, locking, pipe connections, clamps, tee fittings, vacuum plastic and block numbering.",
    "description": "Block vacuum process materials used for marble block preparation, vacuum netting, locking, pipe connections, clamps, tee fittings, vacuum plastic and block numbering.",
    "seoTitle": "Block Vacuum Process Materials | Shravan Enterprises",
    "seoDescription": "Vacuum process supplies for marble block processing and reinforcement. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 2,
    "bannerImage": "block-vacuum-process.jpg",
    "categoryBannerImage": "block-vacuum-process.jpg",
    "icon": "vacuum-accessory-icon",
    "categoryIcon": "vacuum-accessory-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "originalCategory": "Supply of Materials for Block vaccum process"
    }
  },
  {
    "code": "C",
    "name": "Marble Block Triple Reinforcement",
    "slug": "marble-block-triple-reinforcement",
    "parentCategory": null,
    "shortDescription": "Block paste, POP and support items for marble block reinforcement.",
    "longDescription": "Materials for triple reinforcement of marble blocks including block paste systems, wooden wool and POP for block reinforcement and gang saw trolley support.",
    "description": "Materials for triple reinforcement of marble blocks including block paste systems, wooden wool and POP for block reinforcement and gang saw trolley support.",
    "seoTitle": "Marble Block Triple Reinforcement | Shravan Enterprises",
    "seoDescription": "Marble block reinforcement materials for stone processing plants. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 3,
    "bannerImage": "marble-block-reinforcement.jpg",
    "categoryBannerImage": "marble-block-reinforcement.jpg",
    "icon": "block-reinforcement-icon",
    "categoryIcon": "block-reinforcement-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "originalCategory": "Supply of materials for Marble Block Triple Reinforcement"
    }
  },
  {
    "code": "D",
    "name": "Resin Solutions",
    "slug": "resin-solutions",
    "parentCategory": null,
    "shortDescription": "High gloss transparent resin systems for crack and pin-hole filling.",
    "longDescription": "Resin solutions for non-yellowing crack filling and pin-hole filling in marble and stone surfaces, supplied as compatible Part A and Part B systems.",
    "description": "Resin solutions for non-yellowing crack filling and pin-hole filling in marble and stone surfaces, supplied as compatible Part A and Part B systems.",
    "seoTitle": "Resin Solutions | Shravan Enterprises",
    "seoDescription": "Transparent high-gloss resin for marble crack and pin-hole filling. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 4,
    "bannerImage": "resin-solutions.jpg",
    "categoryBannerImage": "resin-solutions.jpg",
    "icon": "resin-icon",
    "categoryIcon": "resin-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "originalCategory": "Supply of Resin"
    }
  },
  {
    "code": "E",
    "name": "Packing Materials",
    "slug": "packing-materials",
    "parentCategory": null,
    "shortDescription": "Packing, pallet protection and surface protection materials for marble dispatch.",
    "longDescription": "Packaging and protection materials for marble and stone products including surface films, stickers, thermocol, air bubble roll, nails, stretch film, edge protectors, foam, tapes and strapping rolls.",
    "description": "Packaging and protection materials for marble and stone products including surface films, stickers, thermocol, air bubble roll, nails, stretch film, edge protectors, foam, tapes and strapping rolls.",
    "seoTitle": "Packing Materials | Shravan Enterprises",
    "seoDescription": "Marble packing materials for safe storage, palletizing and dispatch. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 5,
    "bannerImage": "packing-materials.jpg",
    "categoryBannerImage": "packing-materials.jpg",
    "icon": "packing-icon",
    "categoryIcon": "packing-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "originalCategory": "Supply of Packing materials"
    }
  },
  {
    "code": "F",
    "name": "Chemical Items",
    "slug": "chemical-items",
    "parentCategory": null,
    "shortDescription": "Industrial chemicals and water treatment items for marble and resin work.",
    "longDescription": "Chemical items for slurry, water treatment, resin spray cleaning and slab finishing including flocculent, filter press items, pure acetone and top sealer.",
    "description": "Chemical items for slurry, water treatment, resin spray cleaning and slab finishing including flocculent, filter press items, pure acetone and top sealer.",
    "seoTitle": "Chemical Items | Shravan Enterprises",
    "seoDescription": "Chemical supplies for marble slurry, water treatment and slab finishing. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 6,
    "bannerImage": "chemical-items.jpg",
    "categoryBannerImage": "chemical-items.jpg",
    "icon": "chemical-icon",
    "categoryIcon": "chemical-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "originalCategory": "Supply of Chemicals items"
    }
  },
  {
    "code": "G",
    "name": "Gantry Wire Rope & Belt",
    "slug": "gantry-wire-rope-and-belt",
    "parentCategory": null,
    "shortDescription": "Wire ropes, lifting belts and sleeves for marble block and slab handling.",
    "longDescription": "Lifting and handling products for gantry cranes and marble slab movement including Usha Martin wire ropes, aluminum spliced loops, sealing belts and belt sleeves.",
    "description": "Lifting and handling products for gantry cranes and marble slab movement including Usha Martin wire ropes, aluminum spliced loops, sealing belts and belt sleeves.",
    "seoTitle": "Gantry Wire Rope & Belt | Shravan Enterprises",
    "seoDescription": "Wire rope and lifting belt solutions for marble block handling. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 7,
    "bannerImage": "gantry-wire-rope-belt.jpg",
    "categoryBannerImage": "gantry-wire-rope-belt.jpg",
    "icon": "lifting-rope-icon",
    "categoryIcon": "lifting-rope-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "originalCategory": "Supply of Gantry Wire rope & Belt"
    }
  },
  {
    "code": "H",
    "name": "Safety Items",
    "slug": "safety-items",
    "parentCategory": null,
    "shortDescription": "Safety and cleaning items for marble factory operations.",
    "longDescription": "Safety products and cleaning consumables for marble factories and plant maintenance including gloves, masks, helmets, PVC aprons, acid and cotton rags.",
    "description": "Safety products and cleaning consumables for marble factories and plant maintenance including gloves, masks, helmets, PVC aprons, acid and cotton rags.",
    "seoTitle": "Safety Items | Shravan Enterprises",
    "seoDescription": "Factory safety products for marble, stone and industrial workplaces. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 8,
    "bannerImage": "safety-items.jpg",
    "categoryBannerImage": "safety-items.jpg",
    "icon": "safety-icon",
    "categoryIcon": "safety-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "originalCategory": "Supply of Safety items"
    }
  },
  {
    "code": "I",
    "name": "Civil & Construction Items",
    "slug": "civil-and-construction-items",
    "parentCategory": null,
    "shortDescription": "Civil, construction and finishing supplies for industrial maintenance.",
    "longDescription": "Civil and construction materials for factory work including cement, bricks, sand, paints, putty, waterproofing chemicals, ceiling boards and FRP bathroom doors.",
    "description": "Civil and construction materials for factory work including cement, bricks, sand, paints, putty, waterproofing chemicals, ceiling boards and FRP bathroom doors.",
    "seoTitle": "Civil & Construction Items | Shravan Enterprises",
    "seoDescription": "Civil and construction supplies for factories and maintenance teams. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 9,
    "bannerImage": "civil-construction-items.jpg",
    "categoryBannerImage": "civil-construction-items.jpg",
    "icon": "construction-icon",
    "categoryIcon": "construction-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "originalCategory": "Supply of Civil & Construction items"
    }
  },
  {
    "code": "J",
    "name": "Tools Items",
    "slug": "tools-items",
    "parentCategory": null,
    "shortDescription": "Tools, polishing items and cleaning chemicals for marble finishing work.",
    "longDescription": "Tooling and finishing items for solar panel cleaning, hand polishing, CNC engraving and marble edge polishing.",
    "description": "Tooling and finishing items for solar panel cleaning, hand polishing, CNC engraving and marble edge polishing.",
    "seoTitle": "Tools Items | Shravan Enterprises",
    "seoDescription": "Tools and polishing consumables for marble finishing and CNC work. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 10,
    "bannerImage": "tools-items.jpg",
    "categoryBannerImage": "tools-items.jpg",
    "icon": "tools-icon",
    "categoryIcon": "tools-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "originalCategory": "Supply of tools items"
    }
  },
  {
    "code": "K",
    "name": "Service & Materials Provider",
    "slug": "service-and-materials-provider",
    "parentCategory": null,
    "shortDescription": "Plant maintenance and fabrication services for industrial sites.",
    "longDescription": "Service support for plant leakage, air ventilator fan replacement, roofing sheets, aluminum cabin making, windows, GI suspended ceiling and partition work.",
    "description": "Service support for plant leakage, air ventilator fan replacement, roofing sheets, aluminum cabin making, windows, GI suspended ceiling and partition work.",
    "seoTitle": "Service & Materials Provider | Shravan Enterprises",
    "seoDescription": "Industrial maintenance, roofing, ventilation and fabrication services. Browse quality materials supplied by Shravan Enterprises for marble, FRP and industrial users.",
    "status": "active",
    "isActive": true,
    "sortOrder": 11,
    "bannerImage": "service-materials-provider.jpg",
    "categoryBannerImage": "service-materials-provider.jpg",
    "icon": "service-icon",
    "categoryIcon": "service-icon",
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3-4",
      "originalCategory": "Service and materials provider"
    }
  }
];

const products = [
  {
    "pdfSrNo": "1",
    "name": "Fiber Glass 180 gsm",
    "title": "Fiber Glass 180 gsm",
    "productName": "Fiber Glass 180 gsm",
    "slug": "fiber-glass-180-gsm",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "180 GSM",
    "type": "180 GSM",
    "grade": "180 GSM",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Fiber Glass 180 gsm is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Fiber Glass 180 gsm under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies Fiber Glass 180 gsm under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "Fiber Glass 180 gsm | Category: Manual Fiber Process Materials | UOM: kg | Application: Manual fiber & Filling work",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 1,
    "mainProductImage": "fiber-glass-180-gsm.jpg",
    "mainImage": "fiber-glass-180-gsm.jpg",
    "image": "fiber-glass-180-gsm.jpg",
    "images": [
      "fiber-glass-180-gsm.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "2",
    "name": "GP Resin A Grade marble filling",
    "title": "GP Resin A Grade marble filling",
    "productName": "GP Resin A Grade marble filling",
    "slug": "gp-resin-a-grade-marble-filling",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "A Grade",
    "type": "A Grade",
    "grade": "A Grade",
    "shortLine": "For cobalt base filling purpose.",
    "shortDescription": "GP Resin A Grade marble filling is supplied for cobalt base filling purpose. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies GP Resin A Grade marble filling under the Manual Fiber Process Materials category. This item is mainly used for cobalt base filling purpose and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies GP Resin A Grade marble filling under the Manual Fiber Process Materials category. This item is mainly used for cobalt base filling purpose and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Cobalt base filling purpose. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Cobalt base filling purpose",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "GP Resin A Grade marble filling | Category: Manual Fiber Process Materials | UOM: Kg | Application: Cobalt base filling purpose",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 2,
    "mainProductImage": "gp-resin-a-grade-marble-filling.jpg",
    "mainImage": "gp-resin-a-grade-marble-filling.jpg",
    "image": "gp-resin-a-grade-marble-filling.jpg",
    "images": [
      "gp-resin-a-grade-marble-filling.jpg"
    ],
    "applicationRows": [
      {
        "title": "Cobalt base filling purpose",
        "detail": "Main application: Cobalt base filling purpose. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Cobalt base filling purpose"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Cobalt base filling purpose"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Cobalt base filling purpose",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "3",
    "name": "GP Resin B Grade fiber filling",
    "title": "GP Resin B Grade fiber filling",
    "productName": "GP Resin B Grade fiber filling",
    "slug": "gp-resin-b-grade-fiber-filling",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "B Grade",
    "type": "B Grade",
    "grade": "B Grade",
    "shortLine": "For without cobalt only fiber use (pet).",
    "shortDescription": "GP Resin B Grade fiber filling is supplied for without cobalt only fiber use (pet). It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies GP Resin B Grade fiber filling under the Manual Fiber Process Materials category. This item is mainly used for without cobalt only fiber use (pet) and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies GP Resin B Grade fiber filling under the Manual Fiber Process Materials category. This item is mainly used for without cobalt only fiber use (pet) and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Without cobalt only fiber use (PET). Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Without cobalt only fiber use (PET)",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "GP Resin B Grade fiber filling | Category: Manual Fiber Process Materials | UOM: Kg | Application: Without cobalt only fiber use (PET)",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 3,
    "mainProductImage": "gp-resin-b-grade-fiber-filling.jpg",
    "mainImage": "gp-resin-b-grade-fiber-filling.jpg",
    "image": "gp-resin-b-grade-fiber-filling.jpg",
    "images": [
      "gp-resin-b-grade-fiber-filling.jpg"
    ],
    "applicationRows": [
      {
        "title": "Without cobalt only fiber use (PET)",
        "detail": "Main application: Without cobalt only fiber use (PET). Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Without cobalt only fiber use (PET)"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Without cobalt only fiber use (PET)"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Without cobalt only fiber use (PET)",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "4",
    "name": "Clear Cast resin filling",
    "title": "Clear Cast resin filling",
    "productName": "Clear Cast resin filling",
    "slug": "clear-cast-resin-filling",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "Manual fiber & Filling work",
    "type": "Manual fiber & Filling work",
    "grade": "Manual fiber & Filling work",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Clear Cast resin filling is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Clear Cast resin filling under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies Clear Cast resin filling under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "Clear Cast resin filling | Category: Manual Fiber Process Materials | UOM: kg | Application: Manual fiber & Filling work",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 4,
    "mainProductImage": "clear-cast-resin-filling.jpg",
    "mainImage": "clear-cast-resin-filling.jpg",
    "image": "clear-cast-resin-filling.jpg",
    "images": [
      "clear-cast-resin-filling.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "5",
    "name": "MEKP (Hardener)",
    "title": "MEKP (Hardener)",
    "productName": "MEKP (Hardener)",
    "slug": "mekp-hardener",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "Manual fiber & Filling work",
    "type": "Manual fiber & Filling work",
    "grade": "Manual fiber & Filling work",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "MEKP (Hardener) is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies MEKP (Hardener) under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies MEKP (Hardener) under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "MEKP (Hardener) | Category: Manual Fiber Process Materials | UOM: kg | Application: Manual fiber & Filling work",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 5,
    "mainProductImage": "mekp-hardener.jpg",
    "mainImage": "mekp-hardener.jpg",
    "image": "mekp-hardener.jpg",
    "images": [
      "mekp-hardener.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "6",
    "name": "Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other",
    "title": "Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other",
    "productName": "Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other",
    "slug": "pigment-n-white-dark-cream-n-white-d-a-gary-black-beige-cream-light-cream-and-other",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "White / Cream",
    "type": "White / Cream",
    "grade": "White / Cream",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "Pigment N-White, Dark Cream / N White / D A Gary / Black, Beige Cream / Light Cream & other | Category: Manual Fiber Process Materials | UOM: kg | Application: Manual fiber & Filling work",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 6,
    "mainProductImage": "pigment-n-white-dark-cream-n-white-d-a-gary-black-beige-cream-light-cream-and-other.jpg",
    "mainImage": "pigment-n-white-dark-cream-n-white-d-a-gary-black-beige-cream-light-cream-and-other.jpg",
    "image": "pigment-n-white-dark-cream-n-white-d-a-gary-black-beige-cream-light-cream-and-other.jpg",
    "images": [
      "pigment-n-white-dark-cream-n-white-d-a-gary-black-beige-cream-light-cream-and-other.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "7",
    "name": "Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll",
    "title": "Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll",
    "productName": "Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll",
    "slug": "fiber-net-80-gsm-white-mesh-5x5-jali-50-sqm-roll",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "White / 80 GSM",
    "type": "White / 80 GSM",
    "grade": "White / 80 GSM",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Sqm.",
    "detailedDescription": "Shravan Enterprises supplies Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Sqm.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Sqm"
    ],
    "technicalSummary": "Fiber Net 80 gsm (White Mesh 5x5 / Jali) 50 sqm roll | Category: Manual Fiber Process Materials | UOM: Sqm | Application: Manual fiber & Filling work",
    "unit": "Sqm",
    "uom": "Sqm",
    "moq": "As per requirement",
    "packingSize": "50 sqm roll; 5x5",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 7,
    "mainProductImage": "fiber-net-80-gsm-white-mesh-5x5-jali-50-sqm-roll.jpg",
    "mainImage": "fiber-net-80-gsm-white-mesh-5x5-jali-50-sqm-roll.jpg",
    "image": "fiber-net-80-gsm-white-mesh-5x5-jali-50-sqm-roll.jpg",
    "images": [
      "fiber-net-80-gsm-white-mesh-5x5-jali-50-sqm-roll.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Sqm"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      },
      {
        "label": "Packing / Size",
        "value": "50 sqm roll; 5x5"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "8",
    "name": "Cabosil Powder (Silicon powder) 10 kg bag",
    "title": "Cabosil Powder (Silicon powder) 10 kg bag",
    "productName": "Cabosil Powder (Silicon powder) 10 kg bag",
    "slug": "cabosil-powder-silicon-powder-10-kg-bag",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "Manual fiber & Filling work",
    "type": "Manual fiber & Filling work",
    "grade": "Manual fiber & Filling work",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Cabosil Powder (Silicon powder) 10 kg bag is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Cabosil Powder (Silicon powder) 10 kg bag under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies Cabosil Powder (Silicon powder) 10 kg bag under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "Cabosil Powder (Silicon powder) 10 kg bag | Category: Manual Fiber Process Materials | UOM: kg | Application: Manual fiber & Filling work",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "10 kg bag; 10 kg",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 8,
    "mainProductImage": "cabosil-powder-silicon-powder-10-kg-bag.jpg",
    "mainImage": "cabosil-powder-silicon-powder-10-kg-bag.jpg",
    "image": "cabosil-powder-silicon-powder-10-kg-bag.jpg",
    "images": [
      "cabosil-powder-silicon-powder-10-kg-bag.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      },
      {
        "label": "Packing / Size",
        "value": "10 kg bag; 10 kg"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "9",
    "name": "Mastic Solido Bianco (White)",
    "title": "Mastic Solido Bianco (White)",
    "productName": "Mastic Solido Bianco (White)",
    "slug": "mastic-solido-bianco-white",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "White",
    "type": "White",
    "grade": "White",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Mastic Solido Bianco (White) is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Mastic Solido Bianco (White) under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Mastic Solido Bianco (White) under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Mastic Solido Bianco (White) | Category: Manual Fiber Process Materials | UOM: Kg | Application: Manual fiber & Filling work",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 9,
    "mainProductImage": "mastic-solido-bianco-white.jpg",
    "mainImage": "mastic-solido-bianco-white.jpg",
    "image": "mastic-solido-bianco-white.jpg",
    "images": [
      "mastic-solido-bianco-white.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "10",
    "name": "Mastic Solido Cream",
    "title": "Mastic Solido Cream",
    "productName": "Mastic Solido Cream",
    "slug": "mastic-solido-cream",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "Cream",
    "type": "Cream",
    "grade": "Cream",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Mastic Solido Cream is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Mastic Solido Cream under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Mastic Solido Cream under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Mastic Solido Cream | Category: Manual Fiber Process Materials | UOM: Kg | Application: Manual fiber & Filling work",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 10,
    "mainProductImage": "mastic-solido-cream.jpg",
    "mainImage": "mastic-solido-cream.jpg",
    "image": "mastic-solido-cream.jpg",
    "images": [
      "mastic-solido-cream.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "11",
    "name": "Cobalt 3% and 6%",
    "title": "Cobalt 3% and 6%",
    "productName": "Cobalt 3% and 6%",
    "slug": "cobalt-3-and-6",
    "categoryName": "Manual Fiber Process Materials",
    "categorySlug": "manual-fiber-process-materials",
    "typeGrade": "3% / 6%",
    "type": "3% / 6%",
    "grade": "3% / 6%",
    "shortLine": "For manual fiber & filling work.",
    "shortDescription": "Cobalt 3% and 6% is supplied for manual fiber & filling work. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Cobalt 3% and 6% under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Cobalt 3% and 6% under the Manual Fiber Process Materials category. This item is mainly used for manual fiber & filling work and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual fiber & Filling work",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Cobalt 3% and 6% | Category: Manual Fiber Process Materials | UOM: Kg | Application: Manual fiber & Filling work",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 11,
    "mainProductImage": "cobalt-3-and-6.jpg",
    "mainImage": "cobalt-3-and-6.jpg",
    "image": "cobalt-3-and-6.jpg",
    "images": [
      "cobalt-3-and-6.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual fiber & Filling work",
        "detail": "Main application: Manual fiber & Filling work. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual fiber & Filling work"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Manual Fiber Process Materials"
      },
      {
        "label": "Main application",
        "value": "Manual fiber & Filling work"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "1",
      "pdfApplication": "Manual fiber & Filling work",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "12",
    "name": "EWR 600 GSM Block Roving",
    "title": "EWR 600 GSM Block Roving",
    "productName": "EWR 600 GSM Block Roving",
    "slug": "ewr-600-gsm-block-roving",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "600 GSM",
    "type": "600 GSM",
    "grade": "600 GSM",
    "shortLine": "For block vacuum process.",
    "shortDescription": "EWR 600 GSM Block Roving is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies EWR 600 GSM Block Roving under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies EWR 600 GSM Block Roving under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "EWR 600 GSM Block Roving | Category: Block Vacuum Process Materials | UOM: kg | Application: Block vacuum process",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 12,
    "mainProductImage": "ewr-600-gsm-block-roving.jpg",
    "mainImage": "ewr-600-gsm-block-roving.jpg",
    "image": "ewr-600-gsm-block-roving.jpg",
    "images": [
      "ewr-600-gsm-block-roving.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "13",
    "name": "Bonding Net (Vacuum Net)",
    "title": "Bonding Net (Vacuum Net)",
    "productName": "Bonding Net (Vacuum Net)",
    "slug": "bonding-net-vacuum-net",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Vacuum",
    "type": "Vacuum",
    "grade": "Vacuum",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Bonding Net (Vacuum Net) is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Bonding Net (Vacuum Net) under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "detailedDescription": "Shravan Enterprises supplies Bonding Net (Vacuum Net) under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Mtr"
    ],
    "technicalSummary": "Bonding Net (Vacuum Net) | Category: Block Vacuum Process Materials | UOM: Mtr | Application: Block vacuum process",
    "unit": "Mtr",
    "uom": "Mtr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 13,
    "mainProductImage": "bonding-net-vacuum-net.jpg",
    "mainImage": "bonding-net-vacuum-net.jpg",
    "image": "bonding-net-vacuum-net.jpg",
    "images": [
      "bonding-net-vacuum-net.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Mtr"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "14",
    "name": "Locking Tape",
    "title": "Locking Tape",
    "productName": "Locking Tape",
    "slug": "locking-tape",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Block vacuum process",
    "type": "Block vacuum process",
    "grade": "Block vacuum process",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Locking Tape is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Locking Tape under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "detailedDescription": "Shravan Enterprises supplies Locking Tape under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Mtr"
    ],
    "technicalSummary": "Locking Tape | Category: Block Vacuum Process Materials | UOM: Mtr | Application: Block vacuum process",
    "unit": "Mtr",
    "uom": "Mtr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 14,
    "mainProductImage": "locking-tape.jpg",
    "mainImage": "locking-tape.jpg",
    "image": "locking-tape.jpg",
    "images": [
      "locking-tape.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Mtr"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "15",
    "name": "Easy Spray Fevicol",
    "title": "Easy Spray Fevicol",
    "productName": "Easy Spray Fevicol",
    "slug": "easy-spray-fevicol",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Block vacuum process",
    "type": "Block vacuum process",
    "grade": "Block vacuum process",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Easy Spray Fevicol is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Easy Spray Fevicol under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Easy Spray Fevicol under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Easy Spray Fevicol | Category: Block Vacuum Process Materials | UOM: Nos | Application: Block vacuum process",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 15,
    "mainProductImage": "easy-spray-fevicol.jpg",
    "mainImage": "easy-spray-fevicol.jpg",
    "image": "easy-spray-fevicol.jpg",
    "images": [
      "easy-spray-fevicol.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "16",
    "name": "Vacuum Plastic",
    "title": "Vacuum Plastic",
    "productName": "Vacuum Plastic",
    "slug": "vacuum-plastic",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Vacuum",
    "type": "Vacuum",
    "grade": "Vacuum",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Vacuum Plastic is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Vacuum Plastic under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies Vacuum Plastic under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "Vacuum Plastic | Category: Block Vacuum Process Materials | UOM: kg | Application: Block vacuum process",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 16,
    "mainProductImage": "vacuum-plastic.jpg",
    "mainImage": "vacuum-plastic.jpg",
    "image": "vacuum-plastic.jpg",
    "images": [
      "vacuum-plastic.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "17",
    "name": "Spiral Pipe 15 mm",
    "title": "Spiral Pipe 15 mm",
    "productName": "Spiral Pipe 15 mm",
    "slug": "spiral-pipe-15-mm",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Block vacuum process",
    "type": "Block vacuum process",
    "grade": "Block vacuum process",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Spiral Pipe 15 mm is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Spiral Pipe 15 mm under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: mtr.",
    "detailedDescription": "Shravan Enterprises supplies Spiral Pipe 15 mm under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: mtr.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as mtr"
    ],
    "technicalSummary": "Spiral Pipe 15 mm | Category: Block Vacuum Process Materials | UOM: mtr | Application: Block vacuum process",
    "unit": "mtr",
    "uom": "mtr",
    "moq": "As per requirement",
    "packingSize": "15 mm",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 17,
    "mainProductImage": "spiral-pipe-15-mm.jpg",
    "mainImage": "spiral-pipe-15-mm.jpg",
    "image": "spiral-pipe-15-mm.jpg",
    "images": [
      "spiral-pipe-15-mm.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "mtr"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      },
      {
        "label": "Packing / Size",
        "value": "15 mm"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "18",
    "name": "Pipe 12x16",
    "title": "Pipe 12x16",
    "productName": "Pipe 12x16",
    "slug": "pipe-12x16",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Block vacuum process",
    "type": "Block vacuum process",
    "grade": "Block vacuum process",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Pipe 12x16 is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Pipe 12x16 under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: mtr.",
    "detailedDescription": "Shravan Enterprises supplies Pipe 12x16 under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: mtr.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as mtr"
    ],
    "technicalSummary": "Pipe 12x16 | Category: Block Vacuum Process Materials | UOM: mtr | Application: Block vacuum process",
    "unit": "mtr",
    "uom": "mtr",
    "moq": "As per requirement",
    "packingSize": "12x16",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 18,
    "mainProductImage": "pipe-12x16.jpg",
    "mainImage": "pipe-12x16.jpg",
    "image": "pipe-12x16.jpg",
    "images": [
      "pipe-12x16.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "mtr"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      },
      {
        "label": "Packing / Size",
        "value": "12x16"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "19",
    "name": "Pipe 10x12",
    "title": "Pipe 10x12",
    "productName": "Pipe 10x12",
    "slug": "pipe-10x12",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Block vacuum process",
    "type": "Block vacuum process",
    "grade": "Block vacuum process",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Pipe 10x12 is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Pipe 10x12 under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: mtr.",
    "detailedDescription": "Shravan Enterprises supplies Pipe 10x12 under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: mtr.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as mtr"
    ],
    "technicalSummary": "Pipe 10x12 | Category: Block Vacuum Process Materials | UOM: mtr | Application: Block vacuum process",
    "unit": "mtr",
    "uom": "mtr",
    "moq": "As per requirement",
    "packingSize": "10x12",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 19,
    "mainProductImage": "pipe-10x12.jpg",
    "mainImage": "pipe-10x12.jpg",
    "image": "pipe-10x12.jpg",
    "images": [
      "pipe-10x12.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "mtr"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      },
      {
        "label": "Packing / Size",
        "value": "10x12"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "20",
    "name": "Vacuum Clamp",
    "title": "Vacuum Clamp",
    "productName": "Vacuum Clamp",
    "slug": "vacuum-clamp",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Vacuum",
    "type": "Vacuum",
    "grade": "Vacuum",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Vacuum Clamp is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Vacuum Clamp under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Vacuum Clamp under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Vacuum Clamp | Category: Block Vacuum Process Materials | UOM: Nos | Application: Block vacuum process",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 20,
    "mainProductImage": "vacuum-clamp.jpg",
    "mainImage": "vacuum-clamp.jpg",
    "image": "vacuum-clamp.jpg",
    "images": [
      "vacuum-clamp.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "21",
    "name": "Vacuum Tee",
    "title": "Vacuum Tee",
    "productName": "Vacuum Tee",
    "slug": "vacuum-tee",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Vacuum",
    "type": "Vacuum",
    "grade": "Vacuum",
    "shortLine": "For block vacuum process.",
    "shortDescription": "Vacuum Tee is supplied for block vacuum process. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Vacuum Tee under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Vacuum Tee under the Block Vacuum Process Materials category. This item is mainly used for block vacuum process and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block vacuum process",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Vacuum Tee | Category: Block Vacuum Process Materials | UOM: Nos | Application: Block vacuum process",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 21,
    "mainProductImage": "vacuum-tee.jpg",
    "mainImage": "vacuum-tee.jpg",
    "image": "vacuum-tee.jpg",
    "images": [
      "vacuum-tee.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block vacuum process",
        "detail": "Main application: Block vacuum process. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block vacuum process"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block vacuum process"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block vacuum process",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "22",
    "name": "Bosny Spray for Block Numbering",
    "title": "Bosny Spray for Block Numbering",
    "productName": "Bosny Spray for Block Numbering",
    "slug": "bosny-spray-for-block-numbering",
    "categoryName": "Block Vacuum Process Materials",
    "categorySlug": "block-vacuum-process-materials",
    "typeGrade": "Block numbering",
    "type": "Block numbering",
    "grade": "Block numbering",
    "shortLine": "For block numbering.",
    "shortDescription": "Bosny Spray for Block Numbering is supplied for block numbering. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Bosny Spray for Block Numbering under the Block Vacuum Process Materials category. This item is mainly used for block numbering and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Bosny Spray for Block Numbering under the Block Vacuum Process Materials category. This item is mainly used for block numbering and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Block numbering. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block numbering",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Bosny Spray for Block Numbering | Category: Block Vacuum Process Materials | UOM: Nos | Application: Block numbering",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 22,
    "mainProductImage": "bosny-spray-for-block-numbering.jpg",
    "mainImage": "bosny-spray-for-block-numbering.jpg",
    "image": "bosny-spray-for-block-numbering.jpg",
    "images": [
      "bosny-spray-for-block-numbering.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block numbering",
        "detail": "Main application: Block numbering. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block numbering"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Block Vacuum Process Materials"
      },
      {
        "label": "Main application",
        "value": "Block numbering"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block numbering",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "23",
    "name": "Block Paste Part A Local",
    "title": "Block Paste Part A Local",
    "productName": "Block Paste Part A Local",
    "slug": "block-paste-part-a-local",
    "categoryName": "Marble Block Triple Reinforcement",
    "categorySlug": "marble-block-triple-reinforcement",
    "typeGrade": "Part A / Local",
    "type": "Part A / Local",
    "grade": "Part A / Local",
    "shortLine": "For block reinforcement.",
    "shortDescription": "Block Paste Part A Local is supplied for block reinforcement. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Block Paste Part A Local under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Block Paste Part A Local under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block reinforcement",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Block Paste Part A Local | Category: Marble Block Triple Reinforcement | UOM: Kg | Application: Block reinforcement",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 23,
    "mainProductImage": "block-paste-part-a-local.jpg",
    "mainImage": "block-paste-part-a-local.jpg",
    "image": "block-paste-part-a-local.jpg",
    "images": [
      "block-paste-part-a-local.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block reinforcement",
        "detail": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block reinforcement"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Marble Block Triple Reinforcement"
      },
      {
        "label": "Main application",
        "value": "Block reinforcement"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block reinforcement",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "24",
    "name": "Block Paste Part B Local",
    "title": "Block Paste Part B Local",
    "productName": "Block Paste Part B Local",
    "slug": "block-paste-part-b-local",
    "categoryName": "Marble Block Triple Reinforcement",
    "categorySlug": "marble-block-triple-reinforcement",
    "typeGrade": "Part B / Local",
    "type": "Part B / Local",
    "grade": "Part B / Local",
    "shortLine": "For block reinforcement.",
    "shortDescription": "Block Paste Part B Local is supplied for block reinforcement. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Block Paste Part B Local under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Block Paste Part B Local under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block reinforcement",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Block Paste Part B Local | Category: Marble Block Triple Reinforcement | UOM: Kg | Application: Block reinforcement",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 24,
    "mainProductImage": "block-paste-part-b-local.jpg",
    "mainImage": "block-paste-part-b-local.jpg",
    "image": "block-paste-part-b-local.jpg",
    "images": [
      "block-paste-part-b-local.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block reinforcement",
        "detail": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block reinforcement"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Marble Block Triple Reinforcement"
      },
      {
        "label": "Main application",
        "value": "Block reinforcement"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block reinforcement",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "25",
    "name": "Block Paste Part A Bond Tite Make",
    "title": "Block Paste Part A Bond Tite Make",
    "productName": "Block Paste Part A Bond Tite Make",
    "slug": "block-paste-part-a-bond-tite-make",
    "categoryName": "Marble Block Triple Reinforcement",
    "categorySlug": "marble-block-triple-reinforcement",
    "typeGrade": "Part A / Bond Tite make",
    "type": "Part A / Bond Tite make",
    "grade": "Part A / Bond Tite make",
    "shortLine": "For block reinforcement.",
    "shortDescription": "Block Paste Part A Bond Tite Make is supplied for block reinforcement. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Block Paste Part A Bond Tite Make under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Block Paste Part A Bond Tite Make under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block reinforcement",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Block Paste Part A Bond Tite Make | Category: Marble Block Triple Reinforcement | UOM: Kg | Application: Block reinforcement",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 25,
    "mainProductImage": "block-paste-part-a-bond-tite-make.jpg",
    "mainImage": "block-paste-part-a-bond-tite-make.jpg",
    "image": "block-paste-part-a-bond-tite-make.jpg",
    "images": [
      "block-paste-part-a-bond-tite-make.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block reinforcement",
        "detail": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block reinforcement"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Marble Block Triple Reinforcement"
      },
      {
        "label": "Main application",
        "value": "Block reinforcement"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block reinforcement",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "26",
    "name": "Block Paste Part B Local Bond Tite Make",
    "title": "Block Paste Part B Local Bond Tite Make",
    "productName": "Block Paste Part B Local Bond Tite Make",
    "slug": "block-paste-part-b-local-bond-tite-make",
    "categoryName": "Marble Block Triple Reinforcement",
    "categorySlug": "marble-block-triple-reinforcement",
    "typeGrade": "Part B / Local / Bond Tite make",
    "type": "Part B / Local / Bond Tite make",
    "grade": "Part B / Local / Bond Tite make",
    "shortLine": "For block reinforcement.",
    "shortDescription": "Block Paste Part B Local Bond Tite Make is supplied for block reinforcement. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Block Paste Part B Local Bond Tite Make under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Block Paste Part B Local Bond Tite Make under the Marble Block Triple Reinforcement category. This item is mainly used for block reinforcement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Block reinforcement",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Block Paste Part B Local Bond Tite Make | Category: Marble Block Triple Reinforcement | UOM: Kg | Application: Block reinforcement",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 26,
    "mainProductImage": "block-paste-part-b-local-bond-tite-make.jpg",
    "mainImage": "block-paste-part-b-local-bond-tite-make.jpg",
    "image": "block-paste-part-b-local-bond-tite-make.jpg",
    "images": [
      "block-paste-part-b-local-bond-tite-make.jpg"
    ],
    "applicationRows": [
      {
        "title": "Block reinforcement",
        "detail": "Main application: Block reinforcement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Block reinforcement"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Marble Block Triple Reinforcement"
      },
      {
        "label": "Main application",
        "value": "Block reinforcement"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Block reinforcement",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "27",
    "name": "Wooden Wool",
    "title": "Wooden Wool",
    "productName": "Wooden Wool",
    "slug": "wooden-wool",
    "categoryName": "Marble Block Triple Reinforcement",
    "categorySlug": "marble-block-triple-reinforcement",
    "typeGrade": "Gang saw block trolley",
    "type": "Gang saw block trolley",
    "grade": "Gang saw block trolley",
    "shortLine": "For gang saw block trolley.",
    "shortDescription": "Wooden Wool is supplied for gang saw block trolley. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Wooden Wool under the Marble Block Triple Reinforcement category. This item is mainly used for gang saw block trolley and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bundle.",
    "detailedDescription": "Shravan Enterprises supplies Wooden Wool under the Marble Block Triple Reinforcement category. This item is mainly used for gang saw block trolley and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bundle.",
    "applicationsSummary": "Main application: Gang saw block trolley. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Gang saw block trolley",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Bundle"
    ],
    "technicalSummary": "Wooden Wool | Category: Marble Block Triple Reinforcement | UOM: Bundle | Application: Gang saw block trolley",
    "unit": "Bundle",
    "uom": "Bundle",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 27,
    "mainProductImage": "wooden-wool.jpg",
    "mainImage": "wooden-wool.jpg",
    "image": "wooden-wool.jpg",
    "images": [
      "wooden-wool.jpg"
    ],
    "applicationRows": [
      {
        "title": "Gang saw block trolley",
        "detail": "Main application: Gang saw block trolley. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Gang saw block trolley"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Bundle"
      },
      {
        "label": "Category",
        "value": "Marble Block Triple Reinforcement"
      },
      {
        "label": "Main application",
        "value": "Gang saw block trolley"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Gang saw block trolley",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "28",
    "name": "POP (Diamond)",
    "title": "POP (Diamond)",
    "productName": "POP (Diamond)",
    "slug": "pop-diamond",
    "categoryName": "Marble Block Triple Reinforcement",
    "categorySlug": "marble-block-triple-reinforcement",
    "typeGrade": "Gang saw block trolley",
    "type": "Gang saw block trolley",
    "grade": "Gang saw block trolley",
    "shortLine": "For gang saw block trolley.",
    "shortDescription": "POP (Diamond) is supplied for gang saw block trolley. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies POP (Diamond) under the Marble Block Triple Reinforcement category. This item is mainly used for gang saw block trolley and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bag.",
    "detailedDescription": "Shravan Enterprises supplies POP (Diamond) under the Marble Block Triple Reinforcement category. This item is mainly used for gang saw block trolley and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bag.",
    "applicationsSummary": "Main application: Gang saw block trolley. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Gang saw block trolley",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Bag"
    ],
    "technicalSummary": "POP (Diamond) | Category: Marble Block Triple Reinforcement | UOM: Bag | Application: Gang saw block trolley",
    "unit": "Bag",
    "uom": "Bag",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 28,
    "mainProductImage": "pop-diamond.jpg",
    "mainImage": "pop-diamond.jpg",
    "image": "pop-diamond.jpg",
    "images": [
      "pop-diamond.jpg"
    ],
    "applicationRows": [
      {
        "title": "Gang saw block trolley",
        "detail": "Main application: Gang saw block trolley. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Gang saw block trolley"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Bag"
      },
      {
        "label": "Category",
        "value": "Marble Block Triple Reinforcement"
      },
      {
        "label": "Main application",
        "value": "Gang saw block trolley"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Gang saw block trolley",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "29",
    "name": "Bond Tite High Gloss & Transparent Part A 5 kg Ration",
    "title": "Bond Tite High Gloss & Transparent Part A 5 kg Ration",
    "productName": "Bond Tite High Gloss & Transparent Part A 5 kg Ration",
    "slug": "bond-tite-high-gloss-and-transparent-part-a-5-kg-ration",
    "categoryName": "Resin Solutions",
    "categorySlug": "resin-solutions",
    "typeGrade": "Part A / Bond Tite make / High Gloss / Transparent",
    "type": "Part A / Bond Tite make / High Gloss / Transparent",
    "grade": "Part A / Bond Tite make / High Gloss / Transparent",
    "shortLine": "For for fill up crack & pin hole filling non yellowing.",
    "shortDescription": "Bond Tite High Gloss & Transparent Part A 5 kg Ration is supplied for for fill up crack & pin hole filling non yellowing. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Bond Tite High Gloss & Transparent Part A 5 kg Ration under the Resin Solutions category. This item is mainly used for for fill up crack & pin hole filling non yellowing and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Bond Tite High Gloss & Transparent Part A 5 kg Ration under the Resin Solutions category. This item is mainly used for for fill up crack & pin hole filling non yellowing and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: For fill up crack & pin hole filling non yellowing. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For fill up crack & pin hole filling non yellowing",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Bond Tite High Gloss & Transparent Part A 5 kg Ration | Category: Resin Solutions | UOM: Kg | Application: For fill up crack & pin hole filling non yellowing",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "5 kg",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 29,
    "mainProductImage": "bond-tite-high-gloss-and-transparent-part-a-5-kg-ration.jpg",
    "mainImage": "bond-tite-high-gloss-and-transparent-part-a-5-kg-ration.jpg",
    "image": "bond-tite-high-gloss-and-transparent-part-a-5-kg-ration.jpg",
    "images": [
      "bond-tite-high-gloss-and-transparent-part-a-5-kg-ration.jpg"
    ],
    "applicationRows": [
      {
        "title": "For fill up crack & pin hole filling non yellowing",
        "detail": "Main application: For fill up crack & pin hole filling non yellowing. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For fill up crack & pin hole filling non yellowing"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Resin Solutions"
      },
      {
        "label": "Main application",
        "value": "For fill up crack & pin hole filling non yellowing"
      },
      {
        "label": "Packing / Size",
        "value": "5 kg"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "For fill up crack & pin hole filling non yellowing",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "30",
    "name": "Bond Tite High Gloss & Transparent Part B 2.5 kg Ration",
    "title": "Bond Tite High Gloss & Transparent Part B 2.5 kg Ration",
    "productName": "Bond Tite High Gloss & Transparent Part B 2.5 kg Ration",
    "slug": "bond-tite-high-gloss-and-transparent-part-b-2-5-kg-ration",
    "categoryName": "Resin Solutions",
    "categorySlug": "resin-solutions",
    "typeGrade": "Part B / Bond Tite make / High Gloss / Transparent",
    "type": "Part B / Bond Tite make / High Gloss / Transparent",
    "grade": "Part B / Bond Tite make / High Gloss / Transparent",
    "shortLine": "For for fill up crack & pin hole filling non yellowing.",
    "shortDescription": "Bond Tite High Gloss & Transparent Part B 2.5 kg Ration is supplied for for fill up crack & pin hole filling non yellowing. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Bond Tite High Gloss & Transparent Part B 2.5 kg Ration under the Resin Solutions category. This item is mainly used for for fill up crack & pin hole filling non yellowing and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Bond Tite High Gloss & Transparent Part B 2.5 kg Ration under the Resin Solutions category. This item is mainly used for for fill up crack & pin hole filling non yellowing and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: For fill up crack & pin hole filling non yellowing. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For fill up crack & pin hole filling non yellowing",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Bond Tite High Gloss & Transparent Part B 2.5 kg Ration | Category: Resin Solutions | UOM: Kg | Application: For fill up crack & pin hole filling non yellowing",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "5 kg",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 30,
    "mainProductImage": "bond-tite-high-gloss-and-transparent-part-b-2-5-kg-ration.jpg",
    "mainImage": "bond-tite-high-gloss-and-transparent-part-b-2-5-kg-ration.jpg",
    "image": "bond-tite-high-gloss-and-transparent-part-b-2-5-kg-ration.jpg",
    "images": [
      "bond-tite-high-gloss-and-transparent-part-b-2-5-kg-ration.jpg"
    ],
    "applicationRows": [
      {
        "title": "For fill up crack & pin hole filling non yellowing",
        "detail": "Main application: For fill up crack & pin hole filling non yellowing. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For fill up crack & pin hole filling non yellowing"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Resin Solutions"
      },
      {
        "label": "Main application",
        "value": "For fill up crack & pin hole filling non yellowing"
      },
      {
        "label": "Packing / Size",
        "value": "5 kg"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "For fill up crack & pin hole filling non yellowing",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "31",
    "name": "Surface Protection Film 600mm x 100 mtr Long",
    "title": "Surface Protection Film 600mm x 100 mtr Long",
    "productName": "Surface Protection Film 600mm x 100 mtr Long",
    "slug": "surface-protection-film-600mm-x-100-mtr-long",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Top surface marble protection",
    "type": "Top surface marble protection",
    "grade": "Top surface marble protection",
    "shortLine": "For top surface marble protection.",
    "shortDescription": "Surface Protection Film 600mm x 100 mtr Long is supplied for top surface marble protection. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Surface Protection Film 600mm x 100 mtr Long under the Packing Materials category. This item is mainly used for top surface marble protection and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Roll.",
    "detailedDescription": "Shravan Enterprises supplies Surface Protection Film 600mm x 100 mtr Long under the Packing Materials category. This item is mainly used for top surface marble protection and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Roll.",
    "applicationsSummary": "Main application: Top surface marble protection. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Top surface marble protection",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Roll"
    ],
    "technicalSummary": "Surface Protection Film 600mm x 100 mtr Long | Category: Packing Materials | UOM: Roll | Application: Top surface marble protection",
    "unit": "Roll",
    "uom": "Roll",
    "moq": "As per requirement",
    "packingSize": "600mm x 100 mtr; 600mm; 100 mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 31,
    "mainProductImage": "surface-protection-film-600mm-x-100-mtr-long.jpg",
    "mainImage": "surface-protection-film-600mm-x-100-mtr-long.jpg",
    "image": "surface-protection-film-600mm-x-100-mtr-long.jpg",
    "images": [
      "surface-protection-film-600mm-x-100-mtr-long.jpg"
    ],
    "applicationRows": [
      {
        "title": "Top surface marble protection",
        "detail": "Main application: Top surface marble protection. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Top surface marble protection"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Roll"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Top surface marble protection"
      },
      {
        "label": "Packing / Size",
        "value": "600mm x 100 mtr; 600mm; 100 mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Top surface marble protection",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "32",
    "name": "Self-Adhesive Sticker C-1 40 mtr long",
    "title": "Self-Adhesive Sticker C-1 40 mtr long",
    "productName": "Self-Adhesive Sticker C-1 40 mtr long",
    "slug": "self-adhesive-sticker-c-1-40-mtr-long",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Crack marble application",
    "type": "Crack marble application",
    "grade": "Crack marble application",
    "shortLine": "For crack marble application.",
    "shortDescription": "Self-Adhesive Sticker C-1 40 mtr long is supplied for crack marble application. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Self-Adhesive Sticker C-1 40 mtr long under the Packing Materials category. This item is mainly used for crack marble application and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Roll.",
    "detailedDescription": "Shravan Enterprises supplies Self-Adhesive Sticker C-1 40 mtr long under the Packing Materials category. This item is mainly used for crack marble application and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Roll.",
    "applicationsSummary": "Main application: Crack marble application. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Crack marble application",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Roll"
    ],
    "technicalSummary": "Self-Adhesive Sticker C-1 40 mtr long | Category: Packing Materials | UOM: Roll | Application: Crack marble application",
    "unit": "Roll",
    "uom": "Roll",
    "moq": "As per requirement",
    "packingSize": "40 mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 32,
    "mainProductImage": "self-adhesive-sticker-c-1-40-mtr-long.jpg",
    "mainImage": "self-adhesive-sticker-c-1-40-mtr-long.jpg",
    "image": "self-adhesive-sticker-c-1-40-mtr-long.jpg",
    "images": [
      "self-adhesive-sticker-c-1-40-mtr-long.jpg"
    ],
    "applicationRows": [
      {
        "title": "Crack marble application",
        "detail": "Main application: Crack marble application. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Crack marble application"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Roll"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Crack marble application"
      },
      {
        "label": "Packing / Size",
        "value": "40 mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Crack marble application",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "33",
    "name": "Thermocol Sheet 10M, 12M, 14M, 50M",
    "title": "Thermocol Sheet 10M, 12M, 14M, 50M",
    "productName": "Thermocol Sheet 10M, 12M, 14M, 50M",
    "slug": "thermocol-sheet-10m-12m-14m-50m",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Manual work (Wooden Crate)",
    "type": "Manual work (Wooden Crate)",
    "grade": "Manual work (Wooden Crate)",
    "shortLine": "For manual work (wooden crate).",
    "shortDescription": "Thermocol Sheet 10M, 12M, 14M, 50M is supplied for manual work (wooden crate). It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Thermocol Sheet 10M, 12M, 14M, 50M under the Packing Materials category. This item is mainly used for manual work (wooden crate) and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bundle.",
    "detailedDescription": "Shravan Enterprises supplies Thermocol Sheet 10M, 12M, 14M, 50M under the Packing Materials category. This item is mainly used for manual work (wooden crate) and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bundle.",
    "applicationsSummary": "Main application: Manual work (Wooden Crate). Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual work (Wooden Crate)",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Bundle"
    ],
    "technicalSummary": "Thermocol Sheet 10M, 12M, 14M, 50M | Category: Packing Materials | UOM: Bundle | Application: Manual work (Wooden Crate)",
    "unit": "Bundle",
    "uom": "Bundle",
    "moq": "As per requirement",
    "packingSize": "10M; 12M; 14M",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 33,
    "mainProductImage": "thermocol-sheet-10m-12m-14m-50m.jpg",
    "mainImage": "thermocol-sheet-10m-12m-14m-50m.jpg",
    "image": "thermocol-sheet-10m-12m-14m-50m.jpg",
    "images": [
      "thermocol-sheet-10m-12m-14m-50m.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual work (Wooden Crate)",
        "detail": "Main application: Manual work (Wooden Crate). Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual work (Wooden Crate)"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Bundle"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Manual work (Wooden Crate)"
      },
      {
        "label": "Packing / Size",
        "value": "10M; 12M; 14M"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Manual work (Wooden Crate)",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "34",
    "name": "Air Bubble (Size W-1000 mm x Length 100 Mtr)",
    "title": "Air Bubble (Size W-1000 mm x Length 100 Mtr)",
    "productName": "Air Bubble (Size W-1000 mm x Length 100 Mtr)",
    "slug": "air-bubble-size-w-1000-mm-x-length-100-mtr",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Manual work (Wooden Crate)",
    "type": "Manual work (Wooden Crate)",
    "grade": "Manual work (Wooden Crate)",
    "shortLine": "For manual work (wooden crate).",
    "shortDescription": "Air Bubble (Size W-1000 mm x Length 100 Mtr) is supplied for manual work (wooden crate). It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Air Bubble (Size W-1000 mm x Length 100 Mtr) under the Packing Materials category. This item is mainly used for manual work (wooden crate) and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bundle.",
    "detailedDescription": "Shravan Enterprises supplies Air Bubble (Size W-1000 mm x Length 100 Mtr) under the Packing Materials category. This item is mainly used for manual work (wooden crate) and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bundle.",
    "applicationsSummary": "Main application: Manual work (Wooden Crate). Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Manual work (Wooden Crate)",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Bundle"
    ],
    "technicalSummary": "Air Bubble (Size W-1000 mm x Length 100 Mtr) | Category: Packing Materials | UOM: Bundle | Application: Manual work (Wooden Crate)",
    "unit": "Bundle",
    "uom": "Bundle",
    "moq": "As per requirement",
    "packingSize": "1000 mm; 100 Mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 34,
    "mainProductImage": "air-bubble-size-w-1000-mm-x-length-100-mtr.jpg",
    "mainImage": "air-bubble-size-w-1000-mm-x-length-100-mtr.jpg",
    "image": "air-bubble-size-w-1000-mm-x-length-100-mtr.jpg",
    "images": [
      "air-bubble-size-w-1000-mm-x-length-100-mtr.jpg"
    ],
    "applicationRows": [
      {
        "title": "Manual work (Wooden Crate)",
        "detail": "Main application: Manual work (Wooden Crate). Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Manual work (Wooden Crate)"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Bundle"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Manual work (Wooden Crate)"
      },
      {
        "label": "Packing / Size",
        "value": "1000 mm; 100 Mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Manual work (Wooden Crate)",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "35",
    "name": "Packing Nails 4\"",
    "title": "Packing Nails 4\"",
    "productName": "Packing Nails 4\"",
    "slug": "packing-nails-4",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For marble packing use.",
    "shortDescription": "Packing Nails 4\" is supplied for marble packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Packing Nails 4\" under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Packing Nails 4\" under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Packing Nails 4\" | Category: Packing Materials | UOM: Kg | Application: Marble packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 35,
    "mainProductImage": "packing-nails-4.jpg",
    "mainImage": "packing-nails-4.jpg",
    "image": "packing-nails-4.jpg",
    "images": [
      "packing-nails-4.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble packing use",
        "detail": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Marble packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Marble packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "36",
    "name": "Nails 3x10",
    "title": "Nails 3x10",
    "productName": "Nails 3x10",
    "slug": "nails-3x10",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For marble packing use.",
    "shortDescription": "Nails 3x10 is supplied for marble packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Nails 3x10 under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Nails 3x10 under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Nails 3x10 | Category: Packing Materials | UOM: Kg | Application: Marble packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "3x10",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 36,
    "mainProductImage": "nails-3x10.jpg",
    "mainImage": "nails-3x10.jpg",
    "image": "nails-3x10.jpg",
    "images": [
      "nails-3x10.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble packing use",
        "detail": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Marble packing use"
      },
      {
        "label": "Packing / Size",
        "value": "3x10"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Marble packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "37",
    "name": "Nails 2x12",
    "title": "Nails 2x12",
    "productName": "Nails 2x12",
    "slug": "nails-2x12",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For marble packing use.",
    "shortDescription": "Nails 2x12 is supplied for marble packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Nails 2x12 under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Nails 2x12 under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Nails 2x12 | Category: Packing Materials | UOM: Kg | Application: Marble packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "2x12",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 37,
    "mainProductImage": "nails-2x12.jpg",
    "mainImage": "nails-2x12.jpg",
    "image": "nails-2x12.jpg",
    "images": [
      "nails-2x12.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble packing use",
        "detail": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Marble packing use"
      },
      {
        "label": "Packing / Size",
        "value": "2x12"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Marble packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "38",
    "name": "Nails 4x8",
    "title": "Nails 4x8",
    "productName": "Nails 4x8",
    "slug": "nails-4x8",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For marble packing use.",
    "shortDescription": "Nails 4x8 is supplied for marble packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Nails 4x8 under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Nails 4x8 under the Packing Materials category. This item is mainly used for marble packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Nails 4x8 | Category: Packing Materials | UOM: Kg | Application: Marble packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "4x8",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 38,
    "mainProductImage": "nails-4x8.jpg",
    "mainImage": "nails-4x8.jpg",
    "image": "nails-4x8.jpg",
    "images": [
      "nails-4x8.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble packing use",
        "detail": "Main application: Marble packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Marble packing use"
      },
      {
        "label": "Packing / Size",
        "value": "4x8"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Marble packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "39",
    "name": "Stretch Film",
    "title": "Stretch Film",
    "productName": "Stretch Film",
    "slug": "stretch-film",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "Stretch Film is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Stretch Film under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Stretch Film under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Stretch Film | Category: Packing Materials | UOM: Kg | Application: Pallet packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 39,
    "mainProductImage": "stretch-film.jpg",
    "mainImage": "stretch-film.jpg",
    "image": "stretch-film.jpg",
    "images": [
      "stretch-film.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "40",
    "name": "2 Ply Corrugated Sheet",
    "title": "2 Ply Corrugated Sheet",
    "productName": "2 Ply Corrugated Sheet",
    "slug": "2-ply-corrugated-sheet",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "2 Ply Corrugated Sheet is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies 2 Ply Corrugated Sheet under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies 2 Ply Corrugated Sheet under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "2 Ply Corrugated Sheet | Category: Packing Materials | UOM: Kg | Application: Pallet packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 40,
    "mainProductImage": "2-ply-corrugated-sheet.jpg",
    "mainImage": "2-ply-corrugated-sheet.jpg",
    "image": "2-ply-corrugated-sheet.jpg",
    "images": [
      "2-ply-corrugated-sheet.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "41",
    "name": "Angle Edge Protector All Size",
    "title": "Angle Edge Protector All Size",
    "productName": "Angle Edge Protector All Size",
    "slug": "angle-edge-protector-all-size",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "Angle Edge Protector All Size is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Angle Edge Protector All Size under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "detailedDescription": "Shravan Enterprises supplies Angle Edge Protector All Size under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Mtr"
    ],
    "technicalSummary": "Angle Edge Protector All Size | Category: Packing Materials | UOM: Mtr | Application: Pallet packing use",
    "unit": "Mtr",
    "uom": "Mtr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 41,
    "mainProductImage": "angle-edge-protector-all-size.jpg",
    "mainImage": "angle-edge-protector-all-size.jpg",
    "image": "angle-edge-protector-all-size.jpg",
    "images": [
      "angle-edge-protector-all-size.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Mtr"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "42",
    "name": "EPE Foam C Type",
    "title": "EPE Foam C Type",
    "productName": "EPE Foam C Type",
    "slug": "epe-foam-c-type",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "EPE Foam C Type is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies EPE Foam C Type under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "detailedDescription": "Shravan Enterprises supplies EPE Foam C Type under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Mtr.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Mtr"
    ],
    "technicalSummary": "EPE Foam C Type | Category: Packing Materials | UOM: Mtr | Application: Pallet packing use",
    "unit": "Mtr",
    "uom": "Mtr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 42,
    "mainProductImage": "epe-foam-c-type.jpg",
    "mainImage": "epe-foam-c-type.jpg",
    "image": "epe-foam-c-type.jpg",
    "images": [
      "epe-foam-c-type.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Mtr"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "43",
    "name": "Masking Tape",
    "title": "Masking Tape",
    "productName": "Masking Tape",
    "slug": "masking-tape",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "Masking Tape is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Masking Tape under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Masking Tape under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Masking Tape | Category: Packing Materials | UOM: Nos | Application: Pallet packing use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 43,
    "mainProductImage": "masking-tape.jpg",
    "mainImage": "masking-tape.jpg",
    "image": "masking-tape.jpg",
    "images": [
      "masking-tape.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "44",
    "name": "Transparent / Brown Adhesive Tape 1\", 2\" & 3\"",
    "title": "Transparent / Brown Adhesive Tape 1\", 2\" & 3\"",
    "productName": "Transparent / Brown Adhesive Tape 1\", 2\" & 3\"",
    "slug": "transparent-brown-adhesive-tape-1-2-and-3",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Transparent / Packing",
    "type": "Transparent / Packing",
    "grade": "Transparent / Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "Transparent / Brown Adhesive Tape 1\", 2\" & 3\" is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Transparent / Brown Adhesive Tape 1\", 2\" & 3\" under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Transparent / Brown Adhesive Tape 1\", 2\" & 3\" under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Transparent / Brown Adhesive Tape 1\", 2\" & 3\" | Category: Packing Materials | UOM: Nos | Application: Pallet packing use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 44,
    "mainProductImage": "transparent-brown-adhesive-tape-1-2-and-3.jpg",
    "mainImage": "transparent-brown-adhesive-tape-1-2-and-3.jpg",
    "image": "transparent-brown-adhesive-tape-1-2-and-3.jpg",
    "images": [
      "transparent-brown-adhesive-tape-1-2-and-3.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "45",
    "name": "PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss",
    "title": "PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss",
    "productName": "PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss",
    "slug": "pet-strap-15-x-0-80-mm-20-kg-roll-green-color-emboss",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "PET Strap 15 x 0.80 mm 20 kg Roll Green Color Emboss | Category: Packing Materials | UOM: Kg | Application: Pallet packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "80 mm; 20 kg",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 45,
    "mainProductImage": "pet-strap-15-x-0-80-mm-20-kg-roll-green-color-emboss.jpg",
    "mainImage": "pet-strap-15-x-0-80-mm-20-kg-roll-green-color-emboss.jpg",
    "image": "pet-strap-15-x-0-80-mm-20-kg-roll-green-color-emboss.jpg",
    "images": [
      "pet-strap-15-x-0-80-mm-20-kg-roll-green-color-emboss.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      },
      {
        "label": "Packing / Size",
        "value": "80 mm; 20 kg"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "46",
    "name": "Strapping Roll 9 mm x 300 Mtr 1 x 7 kg",
    "title": "Strapping Roll 9 mm x 300 Mtr 1 x 7 kg",
    "productName": "Strapping Roll 9 mm x 300 Mtr 1 x 7 kg",
    "slug": "strapping-roll-9-mm-x-300-mtr-1-x-7-kg",
    "categoryName": "Packing Materials",
    "categorySlug": "packing-materials",
    "typeGrade": "Packing",
    "type": "Packing",
    "grade": "Packing",
    "shortLine": "For pallet packing use.",
    "shortDescription": "Strapping Roll 9 mm x 300 Mtr 1 x 7 kg is supplied for pallet packing use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Strapping Roll 9 mm x 300 Mtr 1 x 7 kg under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Strapping Roll 9 mm x 300 Mtr 1 x 7 kg under the Packing Materials category. This item is mainly used for pallet packing use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Pallet packing use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Strapping Roll 9 mm x 300 Mtr 1 x 7 kg | Category: Packing Materials | UOM: Kg | Application: Pallet packing use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "9 mm x 300 Mtr; 9 mm; 300 Mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 46,
    "mainProductImage": "strapping-roll-9-mm-x-300-mtr-1-x-7-kg.jpg",
    "mainImage": "strapping-roll-9-mm-x-300-mtr-1-x-7-kg.jpg",
    "image": "strapping-roll-9-mm-x-300-mtr-1-x-7-kg.jpg",
    "images": [
      "strapping-roll-9-mm-x-300-mtr-1-x-7-kg.jpg"
    ],
    "applicationRows": [
      {
        "title": "Pallet packing use",
        "detail": "Main application: Pallet packing use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Pallet packing use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Packing Materials"
      },
      {
        "label": "Main application",
        "value": "Pallet packing use"
      },
      {
        "label": "Packing / Size",
        "value": "9 mm x 300 Mtr; 9 mm; 300 Mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Pallet packing use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "47",
    "name": "Flocculent",
    "title": "Flocculent",
    "productName": "Flocculent",
    "slug": "flocculent",
    "categoryName": "Chemical Items",
    "categorySlug": "chemical-items",
    "typeGrade": "Marble slurry cake",
    "type": "Marble slurry cake",
    "grade": "Marble slurry cake",
    "shortLine": "For marble slurry cake.",
    "shortDescription": "Flocculent is supplied for marble slurry cake. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Flocculent under the Chemical Items category. This item is mainly used for marble slurry cake and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Flocculent under the Chemical Items category. This item is mainly used for marble slurry cake and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: Marble slurry cake. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble slurry cake",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Flocculent | Category: Chemical Items | UOM: Kg | Application: Marble slurry cake",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 47,
    "mainProductImage": "flocculent.jpg",
    "mainImage": "flocculent.jpg",
    "image": "flocculent.jpg",
    "images": [
      "flocculent.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble slurry cake",
        "detail": "Main application: Marble slurry cake. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble slurry cake"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Chemical Items"
      },
      {
        "label": "Main application",
        "value": "Marble slurry cake"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Marble slurry cake",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "48",
    "name": "Filter Press Outer & Inner",
    "title": "Filter Press Outer & Inner",
    "productName": "Filter Press Outer & Inner",
    "slug": "filter-press-outer-and-inner",
    "categoryName": "Chemical Items",
    "categorySlug": "chemical-items",
    "typeGrade": "Water treatment plant",
    "type": "Water treatment plant",
    "grade": "Water treatment plant",
    "shortLine": "For water treatment plant.",
    "shortDescription": "Filter Press Outer & Inner is supplied for water treatment plant. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Filter Press Outer & Inner under the Chemical Items category. This item is mainly used for water treatment plant and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Filter Press Outer & Inner under the Chemical Items category. This item is mainly used for water treatment plant and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Water treatment plant. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Water treatment plant",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Filter Press Outer & Inner | Category: Chemical Items | UOM: Nos | Application: Water treatment plant",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 48,
    "mainProductImage": "filter-press-outer-and-inner.jpg",
    "mainImage": "filter-press-outer-and-inner.jpg",
    "image": "filter-press-outer-and-inner.jpg",
    "images": [
      "filter-press-outer-and-inner.jpg"
    ],
    "applicationRows": [
      {
        "title": "Water treatment plant",
        "detail": "Main application: Water treatment plant. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Water treatment plant"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Chemical Items"
      },
      {
        "label": "Main application",
        "value": "Water treatment plant"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Water treatment plant",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "49",
    "name": "Pure Acetone",
    "title": "Pure Acetone",
    "productName": "Pure Acetone",
    "slug": "pure-acetone",
    "categoryName": "Chemical Items",
    "categorySlug": "chemical-items",
    "typeGrade": "Resin spray cleaning",
    "type": "Resin spray cleaning",
    "grade": "Resin spray cleaning",
    "shortLine": "For resin spray cleaning.",
    "shortDescription": "Pure Acetone is supplied for resin spray cleaning. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Pure Acetone under the Chemical Items category. This item is mainly used for resin spray cleaning and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Pure Acetone under the Chemical Items category. This item is mainly used for resin spray cleaning and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: Resin spray cleaning. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Resin spray cleaning",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Pure Acetone | Category: Chemical Items | UOM: Ltr | Application: Resin spray cleaning",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 49,
    "mainProductImage": "pure-acetone.jpg",
    "mainImage": "pure-acetone.jpg",
    "image": "pure-acetone.jpg",
    "images": [
      "pure-acetone.jpg"
    ],
    "applicationRows": [
      {
        "title": "Resin spray cleaning",
        "detail": "Main application: Resin spray cleaning. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Resin spray cleaning"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Chemical Items"
      },
      {
        "label": "Main application",
        "value": "Resin spray cleaning"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "Resin spray cleaning",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "50",
    "name": "Top Sealer",
    "title": "Top Sealer",
    "productName": "Top Sealer",
    "slug": "top-sealer",
    "categoryName": "Chemical Items",
    "categorySlug": "chemical-items",
    "typeGrade": "For slab use",
    "type": "For slab use",
    "grade": "For slab use",
    "shortLine": "For for slab use.",
    "shortDescription": "Top Sealer is supplied for for slab use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Top Sealer under the Chemical Items category. This item is mainly used for for slab use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Top Sealer under the Chemical Items category. This item is mainly used for for slab use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: For slab use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For slab use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Top Sealer | Category: Chemical Items | UOM: Ltr | Application: For slab use",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 50,
    "mainProductImage": "top-sealer.jpg",
    "mainImage": "top-sealer.jpg",
    "image": "top-sealer.jpg",
    "images": [
      "top-sealer.jpg"
    ],
    "applicationRows": [
      {
        "title": "For slab use",
        "detail": "Main application: For slab use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For slab use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Chemical Items"
      },
      {
        "label": "Main application",
        "value": "For slab use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "2",
      "pdfApplication": "For slab use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "52",
    "name": "Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine)",
    "title": "Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine)",
    "productName": "Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine)",
    "slug": "gantry-wire-rope-25mm-dia-x-9-mtr-long-with-both-side-300-mm-loops-aluminum-spliced-single-sealing-usha-martine",
    "categoryName": "Gantry Wire Rope & Belt",
    "categorySlug": "gantry-wire-rope-and-belt",
    "typeGrade": "Gantry Crane use BLOCK LIFTING",
    "type": "Gantry Crane use BLOCK LIFTING",
    "grade": "Gantry Crane use BLOCK LIFTING",
    "shortLine": "For gantry crane use block lifting.",
    "shortDescription": "Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine) is supplied for gantry crane use block lifting. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine) under the Gantry Wire Rope & Belt category. This item is mainly used for gantry crane use block lifting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine) under the Gantry Wire Rope & Belt category. This item is mainly used for gantry crane use block lifting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Gantry Crane use BLOCK LIFTING. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Gantry Crane use BLOCK LIFTING",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Gantry Wire Rope 25mm Dia x 9 mtr Long with Both Side 300 mm Loops Aluminum Spliced Single Sealing (Usha Martine) | Category: Gantry Wire Rope & Belt | UOM: Nos | Application: Gantry Crane use BLOCK LIFTING",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "25mm Dia x 9 mtr; 25mm; 300 mm",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 52,
    "mainProductImage": "gantry-wire-rope-25mm-dia-x-9-mtr-long-with-both-side-300-mm-loops-aluminum-spliced-single-sealing-usha-martine.jpg",
    "mainImage": "gantry-wire-rope-25mm-dia-x-9-mtr-long-with-both-side-300-mm-loops-aluminum-spliced-single-sealing-usha-martine.jpg",
    "image": "gantry-wire-rope-25mm-dia-x-9-mtr-long-with-both-side-300-mm-loops-aluminum-spliced-single-sealing-usha-martine.jpg",
    "images": [
      "gantry-wire-rope-25mm-dia-x-9-mtr-long-with-both-side-300-mm-loops-aluminum-spliced-single-sealing-usha-martine.jpg"
    ],
    "applicationRows": [
      {
        "title": "Gantry Crane use BLOCK LIFTING",
        "detail": "Main application: Gantry Crane use BLOCK LIFTING. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Gantry Crane use BLOCK LIFTING"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Gantry Wire Rope & Belt"
      },
      {
        "label": "Main application",
        "value": "Gantry Crane use BLOCK LIFTING"
      },
      {
        "label": "Packing / Size",
        "value": "25mm Dia x 9 mtr; 25mm; 300 mm"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Gantry Crane use BLOCK LIFTING",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "53",
    "name": "Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T",
    "title": "Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T",
    "productName": "Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T",
    "slug": "mechanically-aluminum-single-ferrule-spliced-wire-rope-sling-with-375mm-loop-at-both-ends-usha-martin-6x36-steel-core-ungalv-28mm-length-9mtr-swl-10t",
    "categoryName": "Gantry Wire Rope & Belt",
    "categorySlug": "gantry-wire-rope-and-belt",
    "typeGrade": "Gantry Crane use BLOCK LIFTING",
    "type": "Gantry Crane use BLOCK LIFTING",
    "grade": "Gantry Crane use BLOCK LIFTING",
    "shortLine": "For gantry crane use block lifting.",
    "shortDescription": "Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T is supplied for gantry crane use block lifting. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T under the Gantry Wire Rope & Belt category. This item is mainly used for gantry crane use block lifting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T under the Gantry Wire Rope & Belt category. This item is mainly used for gantry crane use block lifting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Gantry Crane use BLOCK LIFTING. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Gantry Crane use BLOCK LIFTING",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Mechanically Aluminum Single Ferrule Spliced Wire Rope Sling with 375mm Loop at Both Ends, Usha Martin 6x36 Steel Core Ungalv. 28mm Length 9Mtr SWL-10T | Category: Gantry Wire Rope & Belt | UOM: Nos | Application: Gantry Crane use BLOCK LIFTING",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "375mm; 28mm; 9Mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 53,
    "mainProductImage": "mechanically-aluminum-single-ferrule-spliced-wire-rope-sling-with-375mm-loop-at-both-ends-usha-martin-6x36-steel-core-ungalv-28mm-length-9mtr-swl-10t.jpg",
    "mainImage": "mechanically-aluminum-single-ferrule-spliced-wire-rope-sling-with-375mm-loop-at-both-ends-usha-martin-6x36-steel-core-ungalv-28mm-length-9mtr-swl-10t.jpg",
    "image": "mechanically-aluminum-single-ferrule-spliced-wire-rope-sling-with-375mm-loop-at-both-ends-usha-martin-6x36-steel-core-ungalv-28mm-length-9mtr-swl-10t.jpg",
    "images": [
      "mechanically-aluminum-single-ferrule-spliced-wire-rope-sling-with-375mm-loop-at-both-ends-usha-martin-6x36-steel-core-ungalv-28mm-length-9mtr-swl-10t.jpg"
    ],
    "applicationRows": [
      {
        "title": "Gantry Crane use BLOCK LIFTING",
        "detail": "Main application: Gantry Crane use BLOCK LIFTING. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Gantry Crane use BLOCK LIFTING"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Gantry Wire Rope & Belt"
      },
      {
        "label": "Main application",
        "value": "Gantry Crane use BLOCK LIFTING"
      },
      {
        "label": "Packing / Size",
        "value": "375mm; 28mm; 9Mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Gantry Crane use BLOCK LIFTING",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "54",
    "name": "Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load",
    "title": "Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load",
    "productName": "Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load",
    "slug": "wire-rope-16mm-size-1-mtr-both-side-loops-effective-length-to-carry-swl-3-mt-load",
    "categoryName": "Gantry Wire Rope & Belt",
    "categorySlug": "gantry-wire-rope-and-belt",
    "typeGrade": "Lifting slab trussel use",
    "type": "Lifting slab trussel use",
    "grade": "Lifting slab trussel use",
    "shortLine": "For lifting slab trussel use.",
    "shortDescription": "Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load is supplied for lifting slab trussel use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load under the Gantry Wire Rope & Belt category. This item is mainly used for lifting slab trussel use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load under the Gantry Wire Rope & Belt category. This item is mainly used for lifting slab trussel use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Lifting slab trussel use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Lifting slab trussel use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Wire Rope 16mm Size 1 mtr Both Side Loops Effective Length to Carry SWL 3 mt Load | Category: Gantry Wire Rope & Belt | UOM: Nos | Application: Lifting slab trussel use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "16mm; 1 mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 54,
    "mainProductImage": "wire-rope-16mm-size-1-mtr-both-side-loops-effective-length-to-carry-swl-3-mt-load.jpg",
    "mainImage": "wire-rope-16mm-size-1-mtr-both-side-loops-effective-length-to-carry-swl-3-mt-load.jpg",
    "image": "wire-rope-16mm-size-1-mtr-both-side-loops-effective-length-to-carry-swl-3-mt-load.jpg",
    "images": [
      "wire-rope-16mm-size-1-mtr-both-side-loops-effective-length-to-carry-swl-3-mt-load.jpg"
    ],
    "applicationRows": [
      {
        "title": "Lifting slab trussel use",
        "detail": "Main application: Lifting slab trussel use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Lifting slab trussel use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Gantry Wire Rope & Belt"
      },
      {
        "label": "Main application",
        "value": "Lifting slab trussel use"
      },
      {
        "label": "Packing / Size",
        "value": "16mm; 1 mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Lifting slab trussel use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "55",
    "name": "Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load",
    "title": "Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load",
    "productName": "Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load",
    "slug": "belt-sealing-125-mm-width-x-5-mtr-length-effective-length-to-carry-5-mt-load",
    "categoryName": "Gantry Wire Rope & Belt",
    "categorySlug": "gantry-wire-rope-and-belt",
    "typeGrade": "Marble slab handling",
    "type": "Marble slab handling",
    "grade": "Marble slab handling",
    "shortLine": "For marble slab handling.",
    "shortDescription": "Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load is supplied for marble slab handling. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load under the Gantry Wire Rope & Belt category. This item is mainly used for marble slab handling and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load under the Gantry Wire Rope & Belt category. This item is mainly used for marble slab handling and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Marble slab handling. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble slab handling",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Belt Sealing 125 mm Width x 5 mtr Length Effective Length to Carry 5 mt Load | Category: Gantry Wire Rope & Belt | UOM: Nos | Application: Marble slab handling",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "125 mm; 5 mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 55,
    "mainProductImage": "belt-sealing-125-mm-width-x-5-mtr-length-effective-length-to-carry-5-mt-load.jpg",
    "mainImage": "belt-sealing-125-mm-width-x-5-mtr-length-effective-length-to-carry-5-mt-load.jpg",
    "image": "belt-sealing-125-mm-width-x-5-mtr-length-effective-length-to-carry-5-mt-load.jpg",
    "images": [
      "belt-sealing-125-mm-width-x-5-mtr-length-effective-length-to-carry-5-mt-load.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble slab handling",
        "detail": "Main application: Marble slab handling. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble slab handling"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Gantry Wire Rope & Belt"
      },
      {
        "label": "Main application",
        "value": "Marble slab handling"
      },
      {
        "label": "Packing / Size",
        "value": "125 mm; 5 mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Marble slab handling",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "56",
    "name": "Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load",
    "title": "Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load",
    "productName": "Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load",
    "slug": "belt-sealing-125-mm-width-x-6-mtr-length-effective-length-to-carry-5-mt-load",
    "categoryName": "Gantry Wire Rope & Belt",
    "categorySlug": "gantry-wire-rope-and-belt",
    "typeGrade": "Marble slab handling",
    "type": "Marble slab handling",
    "grade": "Marble slab handling",
    "shortLine": "For marble slab handling.",
    "shortDescription": "Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load is supplied for marble slab handling. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load under the Gantry Wire Rope & Belt category. This item is mainly used for marble slab handling and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load under the Gantry Wire Rope & Belt category. This item is mainly used for marble slab handling and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Marble slab handling. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble slab handling",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Belt Sealing 125 mm Width x 6 mtr Length Effective Length to Carry 5 mt Load | Category: Gantry Wire Rope & Belt | UOM: Nos | Application: Marble slab handling",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "125 mm; 6 mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 56,
    "mainProductImage": "belt-sealing-125-mm-width-x-6-mtr-length-effective-length-to-carry-5-mt-load.jpg",
    "mainImage": "belt-sealing-125-mm-width-x-6-mtr-length-effective-length-to-carry-5-mt-load.jpg",
    "image": "belt-sealing-125-mm-width-x-6-mtr-length-effective-length-to-carry-5-mt-load.jpg",
    "images": [
      "belt-sealing-125-mm-width-x-6-mtr-length-effective-length-to-carry-5-mt-load.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble slab handling",
        "detail": "Main application: Marble slab handling. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble slab handling"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Gantry Wire Rope & Belt"
      },
      {
        "label": "Main application",
        "value": "Marble slab handling"
      },
      {
        "label": "Packing / Size",
        "value": "125 mm; 6 mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Marble slab handling",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "57",
    "name": "Belt Sleeve 1 mtr",
    "title": "Belt Sleeve 1 mtr",
    "productName": "Belt Sleeve 1 mtr",
    "slug": "belt-sleeve-1-mtr",
    "categoryName": "Gantry Wire Rope & Belt",
    "categorySlug": "gantry-wire-rope-and-belt",
    "typeGrade": "Marble slab handling",
    "type": "Marble slab handling",
    "grade": "Marble slab handling",
    "shortLine": "For marble slab handling.",
    "shortDescription": "Belt Sleeve 1 mtr is supplied for marble slab handling. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Belt Sleeve 1 mtr under the Gantry Wire Rope & Belt category. This item is mainly used for marble slab handling and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Belt Sleeve 1 mtr under the Gantry Wire Rope & Belt category. This item is mainly used for marble slab handling and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Marble slab handling. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble slab handling",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Belt Sleeve 1 mtr | Category: Gantry Wire Rope & Belt | UOM: Nos | Application: Marble slab handling",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "1 mtr",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 57,
    "mainProductImage": "belt-sleeve-1-mtr.jpg",
    "mainImage": "belt-sleeve-1-mtr.jpg",
    "image": "belt-sleeve-1-mtr.jpg",
    "images": [
      "belt-sleeve-1-mtr.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble slab handling",
        "detail": "Main application: Marble slab handling. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble slab handling"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Gantry Wire Rope & Belt"
      },
      {
        "label": "Main application",
        "value": "Marble slab handling"
      },
      {
        "label": "Packing / Size",
        "value": "1 mtr"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Marble slab handling",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "58",
    "name": "100% Cotton Hand Gloves",
    "title": "100% Cotton Hand Gloves",
    "productName": "100% Cotton Hand Gloves",
    "slug": "100-cotton-hand-gloves",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "Safety",
    "type": "Safety",
    "grade": "Safety",
    "shortLine": "For for marble factory safety use.",
    "shortDescription": "100% Cotton Hand Gloves is supplied for for marble factory safety use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies 100% Cotton Hand Gloves under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Pair.",
    "detailedDescription": "Shravan Enterprises supplies 100% Cotton Hand Gloves under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Pair.",
    "applicationsSummary": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Marble Factory Safety use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Pair"
    ],
    "technicalSummary": "100% Cotton Hand Gloves | Category: Safety Items | UOM: Pair | Application: For Marble Factory Safety use",
    "unit": "Pair",
    "uom": "Pair",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 58,
    "mainProductImage": "100-cotton-hand-gloves.jpg",
    "mainImage": "100-cotton-hand-gloves.jpg",
    "image": "100-cotton-hand-gloves.jpg",
    "images": [
      "100-cotton-hand-gloves.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Marble Factory Safety use",
        "detail": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Marble Factory Safety use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Pair"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For Marble Factory Safety use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Marble Factory Safety use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "59",
    "name": "Yellow Mask",
    "title": "Yellow Mask",
    "productName": "Yellow Mask",
    "slug": "yellow-mask",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "Safety",
    "type": "Safety",
    "grade": "Safety",
    "shortLine": "For for marble factory safety use.",
    "shortDescription": "Yellow Mask is supplied for for marble factory safety use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Yellow Mask under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Yellow Mask under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Marble Factory Safety use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Yellow Mask | Category: Safety Items | UOM: Nos | Application: For Marble Factory Safety use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 59,
    "mainProductImage": "yellow-mask.jpg",
    "mainImage": "yellow-mask.jpg",
    "image": "yellow-mask.jpg",
    "images": [
      "yellow-mask.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Marble Factory Safety use",
        "detail": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Marble Factory Safety use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For Marble Factory Safety use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Marble Factory Safety use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "60",
    "name": "Surgical Hand Gloves (50 pair x 1 box)",
    "title": "Surgical Hand Gloves (50 pair x 1 box)",
    "productName": "Surgical Hand Gloves (50 pair x 1 box)",
    "slug": "surgical-hand-gloves-50-pair-x-1-box",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "Safety",
    "type": "Safety",
    "grade": "Safety",
    "shortLine": "For for marble factory safety use.",
    "shortDescription": "Surgical Hand Gloves (50 pair x 1 box) is supplied for for marble factory safety use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Surgical Hand Gloves (50 pair x 1 box) under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: pair.",
    "detailedDescription": "Shravan Enterprises supplies Surgical Hand Gloves (50 pair x 1 box) under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: pair.",
    "applicationsSummary": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Marble Factory Safety use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as pair"
    ],
    "technicalSummary": "Surgical Hand Gloves (50 pair x 1 box) | Category: Safety Items | UOM: pair | Application: For Marble Factory Safety use",
    "unit": "pair",
    "uom": "pair",
    "moq": "As per requirement",
    "packingSize": "50 pair x 1 box",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 60,
    "mainProductImage": "surgical-hand-gloves-50-pair-x-1-box.jpg",
    "mainImage": "surgical-hand-gloves-50-pair-x-1-box.jpg",
    "image": "surgical-hand-gloves-50-pair-x-1-box.jpg",
    "images": [
      "surgical-hand-gloves-50-pair-x-1-box.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Marble Factory Safety use",
        "detail": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Marble Factory Safety use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "pair"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For Marble Factory Safety use"
      },
      {
        "label": "Packing / Size",
        "value": "50 pair x 1 box"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Marble Factory Safety use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "61",
    "name": "Yellow & White Helmet",
    "title": "Yellow & White Helmet",
    "productName": "Yellow & White Helmet",
    "slug": "yellow-and-white-helmet",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "Safety",
    "type": "Safety",
    "grade": "Safety",
    "shortLine": "For for marble factory safety use.",
    "shortDescription": "Yellow & White Helmet is supplied for for marble factory safety use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Yellow & White Helmet under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Yellow & White Helmet under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Marble Factory Safety use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Yellow & White Helmet | Category: Safety Items | UOM: Nos | Application: For Marble Factory Safety use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "Yellow / White",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 61,
    "mainProductImage": "yellow-and-white-helmet.jpg",
    "mainImage": "yellow-and-white-helmet.jpg",
    "image": "yellow-and-white-helmet.jpg",
    "images": [
      "yellow-and-white-helmet.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Marble Factory Safety use",
        "detail": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Marble Factory Safety use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For Marble Factory Safety use"
      },
      {
        "label": "Packing / Size",
        "value": "Yellow / White"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Marble Factory Safety use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "62",
    "name": "PVC Apron 24x36",
    "title": "PVC Apron 24x36",
    "productName": "PVC Apron 24x36",
    "slug": "pvc-apron-24x36",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "Safety",
    "type": "Safety",
    "grade": "Safety",
    "shortLine": "For for marble factory safety use.",
    "shortDescription": "PVC Apron 24x36 is supplied for for marble factory safety use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies PVC Apron 24x36 under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies PVC Apron 24x36 under the Safety Items category. This item is mainly used for for marble factory safety use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Marble Factory Safety use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "PVC Apron 24x36 | Category: Safety Items | UOM: Nos | Application: For Marble Factory Safety use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "24x36",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 62,
    "mainProductImage": "pvc-apron-24x36.jpg",
    "mainImage": "pvc-apron-24x36.jpg",
    "image": "pvc-apron-24x36.jpg",
    "images": [
      "pvc-apron-24x36.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Marble Factory Safety use",
        "detail": "Main application: For Marble Factory Safety use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Marble Factory Safety use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For Marble Factory Safety use"
      },
      {
        "label": "Packing / Size",
        "value": "24x36"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Marble Factory Safety use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "63",
    "name": "Acid",
    "title": "Acid",
    "productName": "Acid",
    "slug": "acid",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "For Marble Block & slab cleaning",
    "type": "For Marble Block & slab cleaning",
    "grade": "For Marble Block & slab cleaning",
    "shortLine": "For for marble block & slab cleaning.",
    "shortDescription": "Acid is supplied for for marble block & slab cleaning. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Acid under the Safety Items category. This item is mainly used for for marble block & slab cleaning and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Acid under the Safety Items category. This item is mainly used for for marble block & slab cleaning and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: For Marble Block & slab cleaning. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Marble Block & slab cleaning",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Acid | Category: Safety Items | UOM: Ltr | Application: For Marble Block & slab cleaning",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 63,
    "mainProductImage": "acid.jpg",
    "mainImage": "acid.jpg",
    "image": "acid.jpg",
    "images": [
      "acid.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Marble Block & slab cleaning",
        "detail": "Main application: For Marble Block & slab cleaning. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Marble Block & slab cleaning"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For Marble Block & slab cleaning"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Marble Block & slab cleaning",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "64",
    "name": "Cotton Rags",
    "title": "Cotton Rags",
    "productName": "Cotton Rags",
    "slug": "cotton-rags",
    "categoryName": "Safety Items",
    "categorySlug": "safety-items",
    "typeGrade": "For plant maintenance use",
    "type": "For plant maintenance use",
    "grade": "For plant maintenance use",
    "shortLine": "For for plant maintenance use.",
    "shortDescription": "Cotton Rags is supplied for for plant maintenance use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Cotton Rags under the Safety Items category. This item is mainly used for for plant maintenance use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies Cotton Rags under the Safety Items category. This item is mainly used for for plant maintenance use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: For plant maintenance use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For plant maintenance use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "Cotton Rags | Category: Safety Items | UOM: kg | Application: For plant maintenance use",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 64,
    "mainProductImage": "cotton-rags.jpg",
    "mainImage": "cotton-rags.jpg",
    "image": "cotton-rags.jpg",
    "images": [
      "cotton-rags.jpg"
    ],
    "applicationRows": [
      {
        "title": "For plant maintenance use",
        "detail": "Main application: For plant maintenance use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For plant maintenance use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Safety Items"
      },
      {
        "label": "Main application",
        "value": "For plant maintenance use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For plant maintenance use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "65",
    "name": "Cement",
    "title": "Cement",
    "productName": "Cement",
    "slug": "cement",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "For Civil work & cement block making",
    "type": "For Civil work & cement block making",
    "grade": "For Civil work & cement block making",
    "shortLine": "For for civil work & cement block making.",
    "shortDescription": "Cement is supplied for for civil work & cement block making. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Cement under the Civil & Construction Items category. This item is mainly used for for civil work & cement block making and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bag.",
    "detailedDescription": "Shravan Enterprises supplies Cement under the Civil & Construction Items category. This item is mainly used for for civil work & cement block making and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Bag.",
    "applicationsSummary": "Main application: For Civil work & cement block making. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Civil work & cement block making",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Bag"
    ],
    "technicalSummary": "Cement | Category: Civil & Construction Items | UOM: Bag | Application: For Civil work & cement block making",
    "unit": "Bag",
    "uom": "Bag",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 65,
    "mainProductImage": "cement.jpg",
    "mainImage": "cement.jpg",
    "image": "cement.jpg",
    "images": [
      "cement.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Civil work & cement block making",
        "detail": "Main application: For Civil work & cement block making. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Civil work & cement block making"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Bag"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "For Civil work & cement block making"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Civil work & cement block making",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "66",
    "name": "Bricks",
    "title": "Bricks",
    "productName": "Bricks",
    "slug": "bricks",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "For Civil work & cement block making",
    "type": "For Civil work & cement block making",
    "grade": "For Civil work & cement block making",
    "shortLine": "For for civil work & cement block making.",
    "shortDescription": "Bricks is supplied for for civil work & cement block making. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Bricks under the Civil & Construction Items category. This item is mainly used for for civil work & cement block making and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Barass.",
    "detailedDescription": "Shravan Enterprises supplies Bricks under the Civil & Construction Items category. This item is mainly used for for civil work & cement block making and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Barass.",
    "applicationsSummary": "Main application: For Civil work & cement block making. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Civil work & cement block making",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Barass"
    ],
    "technicalSummary": "Bricks | Category: Civil & Construction Items | UOM: Barass | Application: For Civil work & cement block making",
    "unit": "Barass",
    "uom": "Barass",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 66,
    "mainProductImage": "bricks.jpg",
    "mainImage": "bricks.jpg",
    "image": "bricks.jpg",
    "images": [
      "bricks.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Civil work & cement block making",
        "detail": "Main application: For Civil work & cement block making. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Civil work & cement block making"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Barass"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "For Civil work & cement block making"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Civil work & cement block making",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "67",
    "name": "White Sand",
    "title": "White Sand",
    "productName": "White Sand",
    "slug": "white-sand",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "For Civil work & cement block making",
    "type": "For Civil work & cement block making",
    "grade": "For Civil work & cement block making",
    "shortLine": "For for civil work & cement block making.",
    "shortDescription": "White Sand is supplied for for civil work & cement block making. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies White Sand under the Civil & Construction Items category. This item is mainly used for for civil work & cement block making and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies White Sand under the Civil & Construction Items category. This item is mainly used for for civil work & cement block making and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: For Civil work & cement block making. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For Civil work & cement block making",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "White Sand | Category: Civil & Construction Items | UOM: kg | Application: For Civil work & cement block making",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 67,
    "mainProductImage": "white-sand.jpg",
    "mainImage": "white-sand.jpg",
    "image": "white-sand.jpg",
    "images": [
      "white-sand.jpg"
    ],
    "applicationRows": [
      {
        "title": "For Civil work & cement block making",
        "detail": "Main application: For Civil work & cement block making. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For Civil work & cement block making"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "For Civil work & cement block making"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For Civil work & cement block making",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "68",
    "name": "Epoxy Paint",
    "title": "Epoxy Paint",
    "productName": "Epoxy Paint",
    "slug": "epoxy-paint",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Painting",
    "type": "Painting",
    "grade": "Painting",
    "shortLine": "For painting.",
    "shortDescription": "Epoxy Paint is supplied for painting. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Epoxy Paint under the Civil & Construction Items category. This item is mainly used for painting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Epoxy Paint under the Civil & Construction Items category. This item is mainly used for painting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: Painting. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Painting",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Epoxy Paint | Category: Civil & Construction Items | UOM: Ltr | Application: Painting",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 68,
    "mainProductImage": "epoxy-paint.jpg",
    "mainImage": "epoxy-paint.jpg",
    "image": "epoxy-paint.jpg",
    "images": [
      "epoxy-paint.jpg"
    ],
    "applicationRows": [
      {
        "title": "Painting",
        "detail": "Main application: Painting. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Painting"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Painting"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Painting",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "69",
    "name": "Oil Paint",
    "title": "Oil Paint",
    "productName": "Oil Paint",
    "slug": "oil-paint",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Painting",
    "type": "Painting",
    "grade": "Painting",
    "shortLine": "For painting.",
    "shortDescription": "Oil Paint is supplied for painting. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Oil Paint under the Civil & Construction Items category. This item is mainly used for painting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Oil Paint under the Civil & Construction Items category. This item is mainly used for painting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: Painting. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Painting",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Oil Paint | Category: Civil & Construction Items | UOM: Ltr | Application: Painting",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 69,
    "mainProductImage": "oil-paint.jpg",
    "mainImage": "oil-paint.jpg",
    "image": "oil-paint.jpg",
    "images": [
      "oil-paint.jpg"
    ],
    "applicationRows": [
      {
        "title": "Painting",
        "detail": "Main application: Painting. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Painting"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Painting"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Painting",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "70",
    "name": "White Putty",
    "title": "White Putty",
    "productName": "White Putty",
    "slug": "white-putty",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Painting",
    "type": "Painting",
    "grade": "Painting",
    "shortLine": "For painting.",
    "shortDescription": "White Putty is supplied for painting. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies White Putty under the Civil & Construction Items category. This item is mainly used for painting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "detailedDescription": "Shravan Enterprises supplies White Putty under the Civil & Construction Items category. This item is mainly used for painting and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: kg.",
    "applicationsSummary": "Main application: Painting. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Painting",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as kg"
    ],
    "technicalSummary": "White Putty | Category: Civil & Construction Items | UOM: kg | Application: Painting",
    "unit": "kg",
    "uom": "kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 70,
    "mainProductImage": "white-putty.jpg",
    "mainImage": "white-putty.jpg",
    "image": "white-putty.jpg",
    "images": [
      "white-putty.jpg"
    ],
    "applicationRows": [
      {
        "title": "Painting",
        "detail": "Main application: Painting. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Painting"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "kg"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Painting"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Painting",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "71",
    "name": "Water Proof Chemicals",
    "title": "Water Proof Chemicals",
    "productName": "Water Proof Chemicals",
    "slug": "water-proof-chemicals",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Avoid leakages",
    "type": "Avoid leakages",
    "grade": "Avoid leakages",
    "shortLine": "For avoid leakages.",
    "shortDescription": "Water Proof Chemicals is supplied for avoid leakages. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Water Proof Chemicals under the Civil & Construction Items category. This item is mainly used for avoid leakages and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Water Proof Chemicals under the Civil & Construction Items category. This item is mainly used for avoid leakages and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: Avoid leakages. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Avoid leakages",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Water Proof Chemicals | Category: Civil & Construction Items | UOM: Ltr | Application: Avoid leakages",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 71,
    "mainProductImage": "water-proof-chemicals.jpg",
    "mainImage": "water-proof-chemicals.jpg",
    "image": "water-proof-chemicals.jpg",
    "images": [
      "water-proof-chemicals.jpg"
    ],
    "applicationRows": [
      {
        "title": "Avoid leakages",
        "detail": "Main application: Avoid leakages. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Avoid leakages"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Avoid leakages"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Avoid leakages",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "72",
    "name": "Gypsum Board for False Ceiling",
    "title": "Gypsum Board for False Ceiling",
    "productName": "Gypsum Board for False Ceiling",
    "slug": "gypsum-board-for-false-ceiling",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Ceiling use",
    "type": "Ceiling use",
    "grade": "Ceiling use",
    "shortLine": "For ceiling use.",
    "shortDescription": "Gypsum Board for False Ceiling is supplied for ceiling use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Gypsum Board for False Ceiling under the Civil & Construction Items category. This item is mainly used for ceiling use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Gypsum Board for False Ceiling under the Civil & Construction Items category. This item is mainly used for ceiling use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Ceiling use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Ceiling use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Gypsum Board for False Ceiling | Category: Civil & Construction Items | UOM: Nos | Application: Ceiling use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 72,
    "mainProductImage": "gypsum-board-for-false-ceiling.jpg",
    "mainImage": "gypsum-board-for-false-ceiling.jpg",
    "image": "gypsum-board-for-false-ceiling.jpg",
    "images": [
      "gypsum-board-for-false-ceiling.jpg"
    ],
    "applicationRows": [
      {
        "title": "Ceiling use",
        "detail": "Main application: Ceiling use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Ceiling use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Ceiling use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Ceiling use",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "73",
    "name": "Cement Board for False Ceiling",
    "title": "Cement Board for False Ceiling",
    "productName": "Cement Board for False Ceiling",
    "slug": "cement-board-for-false-ceiling",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Ceiling use",
    "type": "Ceiling use",
    "grade": "Ceiling use",
    "shortLine": "For ceiling use.",
    "shortDescription": "Cement Board for False Ceiling is supplied for ceiling use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Cement Board for False Ceiling under the Civil & Construction Items category. This item is mainly used for ceiling use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Cement Board for False Ceiling under the Civil & Construction Items category. This item is mainly used for ceiling use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Ceiling use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Ceiling use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Cement Board for False Ceiling | Category: Civil & Construction Items | UOM: Nos | Application: Ceiling use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 73,
    "mainProductImage": "cement-board-for-false-ceiling.jpg",
    "mainImage": "cement-board-for-false-ceiling.jpg",
    "image": "cement-board-for-false-ceiling.jpg",
    "images": [
      "cement-board-for-false-ceiling.jpg"
    ],
    "applicationRows": [
      {
        "title": "Ceiling use",
        "detail": "Main application: Ceiling use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Ceiling use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Ceiling use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Ceiling use",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "74",
    "name": "FRP Bathroom Door",
    "title": "FRP Bathroom Door",
    "productName": "FRP Bathroom Door",
    "slug": "frp-bathroom-door",
    "categoryName": "Civil & Construction Items",
    "categorySlug": "civil-and-construction-items",
    "typeGrade": "Door use",
    "type": "Door use",
    "grade": "Door use",
    "shortLine": "For door use.",
    "shortDescription": "FRP Bathroom Door is supplied for door use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies FRP Bathroom Door under the Civil & Construction Items category. This item is mainly used for door use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies FRP Bathroom Door under the Civil & Construction Items category. This item is mainly used for door use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Door use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Door use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "FRP Bathroom Door | Category: Civil & Construction Items | UOM: Nos | Application: Door use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 74,
    "mainProductImage": "frp-bathroom-door.jpg",
    "mainImage": "frp-bathroom-door.jpg",
    "image": "frp-bathroom-door.jpg",
    "images": [
      "frp-bathroom-door.jpg"
    ],
    "applicationRows": [
      {
        "title": "Door use",
        "detail": "Main application: Door use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Door use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Civil & Construction Items"
      },
      {
        "label": "Main application",
        "value": "Door use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Door use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "75",
    "name": "Solar Panel Cleaning Chemicals Tetra TSPC",
    "title": "Solar Panel Cleaning Chemicals Tetra TSPC",
    "productName": "Solar Panel Cleaning Chemicals Tetra TSPC",
    "slug": "solar-panel-cleaning-chemicals-tetra-tspc",
    "categoryName": "Tools Items",
    "categorySlug": "tools-items",
    "typeGrade": "Solar panel cleaning use",
    "type": "Solar panel cleaning use",
    "grade": "Solar panel cleaning use",
    "shortLine": "For solar panel cleaning use.",
    "shortDescription": "Solar Panel Cleaning Chemicals Tetra TSPC is supplied for solar panel cleaning use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Solar Panel Cleaning Chemicals Tetra TSPC under the Tools Items category. This item is mainly used for solar panel cleaning use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "detailedDescription": "Shravan Enterprises supplies Solar Panel Cleaning Chemicals Tetra TSPC under the Tools Items category. This item is mainly used for solar panel cleaning use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Ltr.",
    "applicationsSummary": "Main application: Solar panel cleaning use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Solar panel cleaning use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Ltr"
    ],
    "technicalSummary": "Solar Panel Cleaning Chemicals Tetra TSPC | Category: Tools Items | UOM: Ltr | Application: Solar panel cleaning use",
    "unit": "Ltr",
    "uom": "Ltr",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 75,
    "mainProductImage": "solar-panel-cleaning-chemicals-tetra-tspc.jpg",
    "mainImage": "solar-panel-cleaning-chemicals-tetra-tspc.jpg",
    "image": "solar-panel-cleaning-chemicals-tetra-tspc.jpg",
    "images": [
      "solar-panel-cleaning-chemicals-tetra-tspc.jpg"
    ],
    "applicationRows": [
      {
        "title": "Solar panel cleaning use",
        "detail": "Main application: Solar panel cleaning use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Solar panel cleaning use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Ltr"
      },
      {
        "label": "Category",
        "value": "Tools Items"
      },
      {
        "label": "Main application",
        "value": "Solar panel cleaning use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Solar panel cleaning use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "76",
    "name": "Wax Polish",
    "title": "Wax Polish",
    "productName": "Wax Polish",
    "slug": "wax-polish",
    "categoryName": "Tools Items",
    "categorySlug": "tools-items",
    "typeGrade": "For top surface hand polish use",
    "type": "For top surface hand polish use",
    "grade": "For top surface hand polish use",
    "shortLine": "For for top surface hand polish use.",
    "shortDescription": "Wax Polish is supplied for for top surface hand polish use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Wax Polish under the Tools Items category. This item is mainly used for for top surface hand polish use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "detailedDescription": "Shravan Enterprises supplies Wax Polish under the Tools Items category. This item is mainly used for for top surface hand polish use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Kg.",
    "applicationsSummary": "Main application: For top surface hand polish use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For top surface hand polish use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Kg"
    ],
    "technicalSummary": "Wax Polish | Category: Tools Items | UOM: Kg | Application: For top surface hand polish use",
    "unit": "Kg",
    "uom": "Kg",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 76,
    "mainProductImage": "wax-polish.jpg",
    "mainImage": "wax-polish.jpg",
    "image": "wax-polish.jpg",
    "images": [
      "wax-polish.jpg"
    ],
    "applicationRows": [
      {
        "title": "For top surface hand polish use",
        "detail": "Main application: For top surface hand polish use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For top surface hand polish use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Kg"
      },
      {
        "label": "Category",
        "value": "Tools Items"
      },
      {
        "label": "Main application",
        "value": "For top surface hand polish use"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For top surface hand polish use",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "77",
    "name": "Engraving Cutting Tool 10mm",
    "title": "Engraving Cutting Tool 10mm",
    "productName": "Engraving Cutting Tool 10mm",
    "slug": "engraving-cutting-tool-10mm",
    "categoryName": "Tools Items",
    "categorySlug": "tools-items",
    "typeGrade": "For engraving CNC machine use",
    "type": "For engraving CNC machine use",
    "grade": "For engraving CNC machine use",
    "shortLine": "For for engraving cnc machine use.",
    "shortDescription": "Engraving Cutting Tool 10mm is supplied for for engraving cnc machine use. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Engraving Cutting Tool 10mm under the Tools Items category. This item is mainly used for for engraving cnc machine use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Engraving Cutting Tool 10mm under the Tools Items category. This item is mainly used for for engraving cnc machine use and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: For engraving CNC machine use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for For engraving CNC machine use",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Engraving Cutting Tool 10mm | Category: Tools Items | UOM: Nos | Application: For engraving CNC machine use",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "10mm",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 77,
    "mainProductImage": "engraving-cutting-tool-10mm.jpg",
    "mainImage": "engraving-cutting-tool-10mm.jpg",
    "image": "engraving-cutting-tool-10mm.jpg",
    "images": [
      "engraving-cutting-tool-10mm.jpg"
    ],
    "applicationRows": [
      {
        "title": "For engraving CNC machine use",
        "detail": "Main application: For engraving CNC machine use. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "For engraving CNC machine use"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Tools Items"
      },
      {
        "label": "Main application",
        "value": "For engraving CNC machine use"
      },
      {
        "label": "Packing / Size",
        "value": "10mm"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "For engraving CNC machine use",
      "reviewNote": "Spelling/size was cleaned from scanned PDF; verify once before final website upload."
    }
  },
  {
    "pdfSrNo": "78",
    "name": "Abrasive Spongy Wheel",
    "title": "Abrasive Spongy Wheel",
    "productName": "Abrasive Spongy Wheel",
    "slug": "abrasive-spongy-wheel",
    "categoryName": "Tools Items",
    "categorySlug": "tools-items",
    "typeGrade": "Marble edge polishing",
    "type": "Marble edge polishing",
    "grade": "Marble edge polishing",
    "shortLine": "For marble edge polishing.",
    "shortDescription": "Abrasive Spongy Wheel is supplied for marble edge polishing. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Abrasive Spongy Wheel under the Tools Items category. This item is mainly used for marble edge polishing and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "detailedDescription": "Shravan Enterprises supplies Abrasive Spongy Wheel under the Tools Items category. This item is mainly used for marble edge polishing and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: Nos.",
    "applicationsSummary": "Main application: Marble edge polishing. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for Marble edge polishing",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as Nos"
    ],
    "technicalSummary": "Abrasive Spongy Wheel | Category: Tools Items | UOM: Nos | Application: Marble edge polishing",
    "unit": "Nos",
    "uom": "Nos",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 78,
    "mainProductImage": "abrasive-spongy-wheel.jpg",
    "mainImage": "abrasive-spongy-wheel.jpg",
    "image": "abrasive-spongy-wheel.jpg",
    "images": [
      "abrasive-spongy-wheel.jpg"
    ],
    "applicationRows": [
      {
        "title": "Marble edge polishing",
        "detail": "Main application: Marble edge polishing. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "Marble edge polishing"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "Nos"
      },
      {
        "label": "Category",
        "value": "Tools Items"
      },
      {
        "label": "Main application",
        "value": "Marble edge polishing"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "Marble edge polishing",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "79",
    "name": "Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets",
    "title": "Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets",
    "productName": "Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets",
    "slug": "pre-monsoon-service-provider-for-plant-leakage-air-ventilator-fan-replacement-and-roofing-sheets",
    "categoryName": "Service & Materials Provider",
    "categorySlug": "service-and-materials-provider",
    "typeGrade": "As per requirement",
    "type": "As per requirement",
    "grade": "As per requirement",
    "shortLine": "For as per requirement.",
    "shortDescription": "Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets is supplied for as per requirement. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets under the Service & Materials Provider category. This item is mainly used for as per requirement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: JOB.",
    "detailedDescription": "Shravan Enterprises supplies Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets under the Service & Materials Provider category. This item is mainly used for as per requirement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: JOB.",
    "applicationsSummary": "Main application: As per requirement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for As per requirement",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as JOB"
    ],
    "technicalSummary": "Pre-Monsoon Service Provider for Plant Leakage, Air Ventilator Fan Replacement and Roofing Sheets | Category: Service & Materials Provider | UOM: JOB | Application: As per requirement",
    "unit": "JOB",
    "uom": "JOB",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 79,
    "mainProductImage": "pre-monsoon-service-provider-for-plant-leakage-air-ventilator-fan-replacement-and-roofing-sheets.jpg",
    "mainImage": "pre-monsoon-service-provider-for-plant-leakage-air-ventilator-fan-replacement-and-roofing-sheets.jpg",
    "image": "pre-monsoon-service-provider-for-plant-leakage-air-ventilator-fan-replacement-and-roofing-sheets.jpg",
    "images": [
      "pre-monsoon-service-provider-for-plant-leakage-air-ventilator-fan-replacement-and-roofing-sheets.jpg"
    ],
    "applicationRows": [
      {
        "title": "As per requirement",
        "detail": "Main application: As per requirement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "As per requirement"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "JOB"
      },
      {
        "label": "Category",
        "value": "Service & Materials Provider"
      },
      {
        "label": "Main application",
        "value": "As per requirement"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "3",
      "pdfApplication": "As per requirement",
      "reviewNote": ""
    }
  },
  {
    "pdfSrNo": "80",
    "name": "Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System",
    "title": "Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System",
    "productName": "Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System",
    "slug": "aluminum-cabin-window-making-gi-suspended-ceiling-and-partition-system",
    "categoryName": "Service & Materials Provider",
    "categorySlug": "service-and-materials-provider",
    "typeGrade": "As per requirement",
    "type": "As per requirement",
    "grade": "As per requirement",
    "shortLine": "For as per requirement.",
    "shortDescription": "Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System is supplied for as per requirement. It is suitable for marble, stone, FRP, packing, maintenance and industrial production requirements.",
    "description": "Shravan Enterprises supplies Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System under the Service & Materials Provider category. This item is mainly used for as per requirement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: JOB.",
    "detailedDescription": "Shravan Enterprises supplies Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System under the Service & Materials Provider category. This item is mainly used for as per requirement and helps support reliable workflow in marble stone processing, FRP raw material handling, block reinforcement, packing, safety, maintenance and related industrial applications. Available unit: JOB.",
    "applicationsSummary": "Main application: As per requirement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
    "industriesServed": [
      "Marble & stone processing",
      "FRP raw materials",
      "industrial maintenance",
      "packing",
      "factory operations"
    ],
    "keyFeatures": [
      "Reliable supply quality",
      "Suitable for As per requirement",
      "Easy to use in daily production",
      "Supports consistent process output",
      "Unit tracked as JOB"
    ],
    "technicalSummary": "Aluminum Cabin, Window Making, GI Suspended Ceiling and Partition System | Category: Service & Materials Provider | UOM: JOB | Application: As per requirement",
    "unit": "JOB",
    "uom": "JOB",
    "moq": "As per requirement",
    "packingSize": "",
    "status": "published",
    "isPublished": true,
    "featured": false,
    "isFeatured": false,
    "sortOrder": 80,
    "mainProductImage": "aluminum-cabin-window-making-gi-suspended-ceiling-and-partition-system.jpg",
    "mainImage": "aluminum-cabin-window-making-gi-suspended-ceiling-and-partition-system.jpg",
    "image": "aluminum-cabin-window-making-gi-suspended-ceiling-and-partition-system.jpg",
    "images": [
      "aluminum-cabin-window-making-gi-suspended-ceiling-and-partition-system.jpg"
    ],
    "applicationRows": [
      {
        "title": "As per requirement",
        "detail": "Main application: As per requirement. Best suited for marble factories, stone processing units, FRP work and industrial users.",
        "sourcePdfApplication": "As per requirement"
      }
    ],
    "technicalRows": [
      {
        "label": "Unit of measurement",
        "value": "JOB"
      },
      {
        "label": "Category",
        "value": "Service & Materials Provider"
      },
      {
        "label": "Main application",
        "value": "As per requirement"
      }
    ],
    "source": {
      "document": "Shravan_product.pdf",
      "page": "4",
      "pdfApplication": "As per requirement",
      "reviewNote": ""
    }
  }
];


function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isObjectIdLike(value) {
  return value && typeof value === "object" && typeof value.toHexString === "function";
}

function getIdString(value) {
  if (!value) return "";
  if (isObjectIdLike(value)) return value.toHexString();
  return String(value);
}

function getUniqueCategories(inputCategories) {
  const seen = new Set();
  const unique = [];
  const duplicates = [];

  for (const category of inputCategories) {
    const key = normalizeText(category.name || category.slug);
    if (!key) continue;

    if (seen.has(key)) {
      duplicates.push(category.name || category.slug);
      continue;
    }

    seen.add(key);
    unique.push(category);
  }

  return { unique, duplicates };
}

function getUniqueProducts(inputProducts) {
  const seen = new Set();
  const unique = [];
  const duplicates = [];

  for (const product of inputProducts) {
    const productName = product.name || product.productName || product.title;
    const productKey = normalizeText(productName);
    const categoryKey = normalizeText(product.categoryName || product.categorySlug || product.category);
    const key = `${productKey}::${categoryKey}`;

    if (!productKey || !categoryKey) continue;

    if (seen.has(key)) {
      duplicates.push({ name: productName, categoryName: product.categoryName || product.categorySlug });
      continue;
    }

    seen.add(key);
    unique.push(product);
  }

  return { unique, duplicates };
}

async function getDatabaseConnection() {
  try {
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    await client.connect();
    return {
      db: client.db(),
      close: async () => client.close(),
      driver: "mongodb",
    };
  } catch (mongoDriverError) {
    try {
      const mongoose = require("mongoose");
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
      return {
        db: mongoose.connection.db,
        close: async () => mongoose.disconnect(),
        driver: "mongoose",
      };
    } catch (mongooseError) {
      throw new Error(
        "MongoDB connection failed. Install mongodb or mongoose and check MONGODB_URI.\n" +
          `mongodb package error: ${mongoDriverError.message}\n` +
          `mongoose package error: ${mongooseError.message}`
      );
    }
  }
}

async function safeCreateIndex(collection, index, options = {}) {
  try {
    await collection.createIndex(index, options);
  } catch (error) {
    console.warn(`Index warning on ${collection.collectionName || "collection"}: ${error.message}`);
  }
}

function buildCategoryDoc(category, now) {
  const slug = category.slug || slugify(category.name);
  const nameKey = normalizeText(category.name);

  return {
    ...category,
    name: category.name,
    title: category.name,
    label: category.name,
    slug,
    nameKey,

    // Common CMS/admin fields
    parent: category.parentCategory || null,
    parentCategory: category.parentCategory || null,
    description: category.longDescription || category.description || category.shortDescription || "",
    shortDescription: category.shortDescription || "",
    longDescription: category.longDescription || category.description || "",

    status: category.status || "active",
    isActive: category.isActive !== false,
    active: true,
    published: true,

    image: category.bannerImage || category.categoryBannerImage || "",
    banner: category.bannerImage || category.categoryBannerImage || "",
    bannerImage: category.bannerImage || category.categoryBannerImage || "",
    icon: category.icon || category.categoryIcon || "",

    seoTitle: category.seoTitle || `${category.name} | Shravan Enterprises`,
    seoDescription: category.seoDescription || category.shortDescription || "",
    metaTitle: category.seoTitle || `${category.name} | Shravan Enterprises`,
    metaDescription: category.seoDescription || category.shortDescription || "",

    seedKey: SEED_KEY,
    updatedAt: now,
  };
}

async function upsertCategory(categoryCollection, category) {
  const now = new Date();
  const slug = category.slug || slugify(category.name);
  const nameKey = normalizeText(category.name);

  const existing = await categoryCollection.findOne({
    $or: [{ name: category.name }, { title: category.name }, { slug }, { nameKey }],
  });

  const doc = buildCategoryDoc({ ...category, slug }, now);

  if (existing?._id) {
    await categoryCollection.updateOne({ _id: existing._id }, { $set: doc });
    return { id: existing._id, doc: { ...doc, _id: existing._id }, inserted: false };
  }

  const result = await categoryCollection.insertOne({ ...doc, createdAt: now });
  return { id: result.insertedId, doc: { ...doc, _id: result.insertedId }, inserted: true };
}

function getProductName(product) {
  return product.name || product.productName || product.title || "";
}

function getCategoryValue(categoryDoc) {
  const mode = String(process.env.CATEGORY_VALUE_MODE || "slug").toLowerCase();
  const idString = getIdString(categoryDoc._id);

  // DEFAULT slug is used because many admin panels save/select category by slug.
  // You still get categoryId/category_id/categoryRef stored with the Mongo _id below.
  if (mode === "id" || mode === "objectid") return categoryDoc._id;
  if (mode === "idstring" || mode === "stringid") return idString;
  if (mode === "name") return categoryDoc.name;
  if (mode === "object" || mode === "embedded") {
    return { _id: categoryDoc._id, id: idString, name: categoryDoc.name, slug: categoryDoc.slug };
  }
  return categoryDoc.slug; // slug mode
}

function buildProductDuplicateQuery(product, categoryDoc) {
  const productName = getProductName(product);
  const nameKey = normalizeText(productName);
  const categoryName = categoryDoc?.name || product.categoryName || "";
  const categorySlug = categoryDoc?.slug || product.categorySlug || "";
  const categoryNameKey = normalizeText(categoryName || categorySlug);
  const categoryIdString = getIdString(categoryDoc?._id);

  const nameChecks = [
    { name: productName },
    { productName },
    { title: productName },
    { slug: product.slug },
    { nameKey },
  ].filter((q) => Object.values(q)[0] !== undefined && Object.values(q)[0] !== "");

  const categoryChecks = [
    { categoryName },
    { categorySlug },
    { categoryNameKey },
    { category: categorySlug },
    { category: categoryName },
    { categoryId: categoryIdString },
    { category_id: categoryIdString },
    { categoryRef: categoryIdString },
  ];

  if (categoryDoc?._id) {
    categoryChecks.push({ categoryId: categoryDoc._id });
    categoryChecks.push({ category_id: categoryDoc._id });
    categoryChecks.push({ categoryRef: categoryDoc._id });
    categoryChecks.push({ category: categoryDoc._id });
  }

  return { $and: [{ $or: nameChecks }, { $or: categoryChecks }] };
}

function buildProductDoc(product, categoryDoc, now) {
  const productName = getProductName(product);
  const categoryName = categoryDoc.name;
  const categorySlug = categoryDoc.slug;
  const categoryIdString = getIdString(categoryDoc._id);
  const categoryNameKey = normalizeText(categoryName);
  const nameKey = normalizeText(productName);
  const categoryValue = getCategoryValue(categoryDoc);
  const image = product.mainProductImage || product.mainImage || product.image || `${product.slug || slugify(productName)}.jpg`;

  return {
    ...product,

    // Product main identity fields used by different admin templates
    name: productName,
    productName,
    title: productName,
    slug: product.slug || slugify(productName),
    nameKey,
    duplicateKey: `${nameKey}::${categoryNameKey}`,

    // IMPORTANT CATEGORY FIX
    // category defaults to category slug for frontend/admin filtering.
    // categoryId/category_id/categoryRef always contain the Mongo category id too.
    category: categoryValue,
    categoryId: categoryDoc._id,
    category_id: categoryDoc._id,
    categoryRef: categoryDoc._id,
    categoryIdString,
    categoryObjectId: categoryDoc._id,
    categoryName,
    categoryTitle: categoryName,
    categorySlug,
    categoryNameKey,
    categoryInfo: {
      _id: categoryDoc._id,
      id: categoryIdString,
      name: categoryName,
      title: categoryName,
      slug: categorySlug,
      code: categoryDoc.code || "",
    },

    // Image aliases
    image,
    mainImage: image,
    mainProductImage: image,
    imageUrl: image,

    // Content aliases matching product popup fields
    shortLine: product.shortLine || product.shortDescription || "",
    shortDescription: product.shortDescription || product.shortLine || "",
    description: product.detailedDescription || product.description || product.shortDescription || "",
    detailedDescription: product.detailedDescription || product.description || "",
    applicationsSummary: product.applicationsSummary || product.application || product.pdfApplication || "",
    application: product.application || product.pdfApplication || "",
    industriesServed: product.industriesServed || "Marble & stone processing, FRP raw materials, industrial maintenance, packing, factory operations",
    keyFeatures: product.keyFeatures || [],
    technicalSummary: product.technicalSummary || "",

    status: product.status || "published",
    isActive: true,
    active: true,
    published: true,
    featured: product.featured || false,

    seoTitle: product.seoTitle || `${productName} | Shravan Enterprises`,
    seoDescription: product.seoDescription || product.shortDescription || "",
    metaTitle: product.seoTitle || `${productName} | Shravan Enterprises`,
    metaDescription: product.seoDescription || product.shortDescription || "",

    seedKey: SEED_KEY,
    updatedAt: now,
  };
}

async function upsertProduct(productCollection, product, categoryDoc) {
  const now = new Date();
  const duplicateQuery = buildProductDuplicateQuery(product, categoryDoc);
  const existing = await productCollection.findOne(duplicateQuery);
  const doc = buildProductDoc(product, categoryDoc, now);

  if (existing?._id) {
    await productCollection.updateOne({ _id: existing._id }, { $set: doc });
    return { id: existing._id, doc: { ...doc, _id: existing._id }, inserted: false };
  }

  try {
    const result = await productCollection.insertOne({ ...doc, createdAt: now });
    return { id: result.insertedId, doc: { ...doc, _id: result.insertedId }, inserted: true };
  } catch (error) {
    // If your app already has a unique slug index, update that row instead of creating a duplicate.
    if (error && error.code === 11000 && product.slug) {
      const slugMatch = await productCollection.findOne({ slug: product.slug });
      if (slugMatch?._id) {
        await productCollection.updateOne({ _id: slugMatch._id }, { $set: doc });
        return { id: slugMatch._id, doc: { ...doc, _id: slugMatch._id }, inserted: false, duplicateSlugRecovered: true };
      }
    }
    throw error;
  }
}

async function cleanupDuplicateSeedProducts(productCollection) {
  // Removes duplicates created by this seed only, based on product name + category.
  // Keeps the newest/first record and deletes only extra seeded duplicates.
  const seeded = await productCollection
    .find({ seedKey: SEED_KEY })
    .project({ _id: 1, name: 1, productName: 1, title: 1, categoryName: 1, categorySlug: 1, categoryNameKey: 1, updatedAt: 1 })
    .toArray();

  const groups = new Map();
  for (const doc of seeded) {
    const nameKey = normalizeText(doc.name || doc.productName || doc.title);
    const categoryKey = normalizeText(doc.categoryName || doc.categorySlug || doc.categoryNameKey);
    const key = `${nameKey}::${categoryKey}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(doc);
  }

  const idsToDelete = [];
  for (const docs of groups.values()) {
    if (docs.length <= 1) continue;
    docs.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    idsToDelete.push(...docs.slice(1).map((doc) => doc._id));
  }

  if (idsToDelete.length) {
    await productCollection.deleteMany({ _id: { $in: idsToDelete }, seedKey: SEED_KEY });
  }

  return idsToDelete.length;
}

async function attachProductsToCategories(categoryCollection, categoryToProductIds) {
  let updated = 0;

  for (const [categoryIdString, payload] of categoryToProductIds.entries()) {
    const { categoryId, productIds, productIdStrings, productSlugs } = payload;
    await categoryCollection.updateOne(
      { _id: categoryId },
      {
        $set: {
          productCount: productIds.length,
          updatedAt: new Date(),
        },
        $addToSet: {
          products: { $each: productIds },
          productIds: { $each: productIds },
          productIdStrings: { $each: productIdStrings },
          productSlugs: { $each: productSlugs },
        },
      }
    );
    updated += 1;
  }

  return updated;
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.log(`MONGODB_URI missing. Using safe default: ${MONGODB_URI}`);
  }

  const { unique: uniqueCategories, duplicates: duplicateCategories } = getUniqueCategories(categories);
  const { unique: uniqueProducts, duplicates: duplicateProducts } = getUniqueProducts(products);

  const connection = await getDatabaseConnection();
  const db = connection.db;
  const categoryCollection = db.collection(CATEGORY_COLLECTION);
  const productCollection = db.collection(PRODUCT_COLLECTION);

  console.log(`Connected using: ${connection.driver}`);
  console.log(`Database: ${db.databaseName}`);
  console.log(`Collections: ${CATEGORY_COLLECTION}, ${PRODUCT_COLLECTION}`);
  console.log(`Category value mode: ${process.env.CATEGORY_VALUE_MODE || "slug"}`);
  console.log(`Seed data: ${uniqueCategories.length} unique categories, ${uniqueProducts.length} unique products/services`);

  if (duplicateCategories.length) console.log(`Skipped duplicate categories in seed input: ${duplicateCategories.length}`);
  if (duplicateProducts.length) console.log(`Skipped duplicate products in seed input by name + category: ${duplicateProducts.length}`);

  await safeCreateIndex(categoryCollection, { nameKey: 1 });
  await safeCreateIndex(categoryCollection, { slug: 1 });
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

  for (const category of uniqueCategories) {
    const result = await upsertCategory(categoryCollection, category);
    if (result.inserted) insertedCategories += 1;
    else updatedCategories += 1;

    categoryBySlug.set(result.doc.slug, result.doc);
    categoryByName.set(result.doc.name, result.doc);
  }

  let insertedProducts = 0;
  let updatedProducts = 0;
  let recoveredFromSlugConflicts = 0;

  for (const product of uniqueProducts) {
    const categoryDoc =
      categoryBySlug.get(product.categorySlug) ||
      categoryByName.get(product.categoryName) ||
      categoryBySlug.get(slugify(product.categoryName));

    if (!categoryDoc?._id) {
      console.warn(`⚠️ Category not found for product: ${getProductName(product)} (${product.categoryName || product.categorySlug})`);
      continue;
    }

    const result = await upsertProduct(productCollection, product, categoryDoc);
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

  const removedDuplicates = await cleanupDuplicateSeedProducts(productCollection);
  const linkedCategories = await attachProductsToCategories(categoryCollection, categoryToProductIds);

  await connection.close();

  console.log("✅ Seed completed successfully.");
  console.log(`Categories: ${insertedCategories} inserted, ${updatedCategories} updated`);
  console.log(`Products: ${insertedProducts} inserted, ${updatedProducts} updated`);
  console.log(`Category links repaired: ${linkedCategories} categories updated with product IDs`);
  console.log(`Duplicate seeded products removed: ${removedDuplicates}`);

  if (recoveredFromSlugConflicts) console.log(`Recovered from existing slug conflicts: ${recoveredFromSlugConflicts}`);
  console.log("\nNow restart your backend and refresh admin panel. Products should no longer show Unassigned.");
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error.message);
  console.error(error.stack);
  process.exit(1);
});
