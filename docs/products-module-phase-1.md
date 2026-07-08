# Shravan Enterprises — Products Module Phase 1 (MongoDB)

## Goal
Build an enterprise-grade product catalog foundation for industrial products using the repo’s actual stack: MongoDB, REST APIs, JWT auth, and object storage for files.

## Architecture Decision
- **Database:** MongoDB
- **API style:** REST
- **Auth:** JWT + role-based access
- **Files:** object storage with signed uploads
- **Search:** Mongo aggregation first, external search later

## Design Principles
- One canonical product document per product.
- Keep taxonomy, media, SEO, specs, and inquiry data structured and queryable.
- Use embedded arrays for tightly coupled product data.
- Use reference IDs for reusable lookup collections.
- Support soft delete, audit history, and admin workflows.

## Core Collections

### 1) `categories`
Top-level product families.
- `_id` ObjectId / UUID-equivalent string
- `name` string
- `slug` string unique
- `description` string|null
- `shortDescription` string|null
- `iconUrl` string|null
- `bannerImageUrl` string|null
- `seoMetaId` string|null
- `sortOrder` number default 0
- `isActive` boolean default true
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

**Indexes**
- unique on `slug`
- compound on `isActive`, `sortOrder`

### 2) `subcategories`
Optional nested grouping under categories.
- `_id`
- `categoryId` string ref `categories._id`
- `name`
- `slug` unique
- `description`
- `sortOrder`
- `isActive`
- `deletedAt`
- `createdAt`
- `updatedAt`

**Indexes**
- unique on `slug`
- compound on `categoryId`, `sortOrder`

### 3) `industries`
Reusable industry lookup.
- `_id`
- `name`
- `slug` unique
- `description`
- `sortOrder`
- `isActive`
- `deletedAt`
- `createdAt`
- `updatedAt`

### 4) `applications`
Reusable application lookup.
- `_id`
- `name`
- `slug` unique
- `description`
- `sortOrder`
- `isActive`
- `deletedAt`
- `createdAt`
- `updatedAt`

### 5) `tags`
Searchable product tags.
- `_id`
- `name`
- `slug` unique
- `deletedAt`
- `createdAt`
- `updatedAt`

### 6) `seo_meta`
Shared SEO metadata for products and categories.
- `_id`
- `entityType` one of `product|category|subcategory`
- `entityId` string
- `metaTitle` string|null
- `metaDescription` string|null
- `keywords` string[]|null
- `canonicalUrl` string|null
- `ogImageUrl` string|null
- `schemaJson` object|null
- `robots` string|null
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

### 7) `products`
Main product document.
- `_id`
- `categoryId` string ref `categories._id`
- `subcategoryId` string|null ref `subcategories._id`
- `name` string
- `slug` string unique
- `sku` string unique
- `shortDescription` string|null
- `fullDescription` string|null
- `brand` string|null
- `productType` string|null
- `industryType` string|null
- `chemicalType` string|null
- `physicalAppearance` string|null
- `viscosity` string|null
- `phValue` string|null
- `density` string|null
- `solidContent` string|null
- `packagingType` string|null
- `storageConditions` string|null
- `shelfLife` string|null
- `status` string enum `draft|published|archived`
- `isFeatured` boolean default false
- `isTrending` boolean default false
- `showOnHomepage` boolean default false
- `priority` number default 0
- `sortOrder` number default 0
- `primaryImage` object|null
- `seoMetaId` string|null
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

**Indexes**
- unique on `slug`
- unique on `sku`
- compound on `categoryId`, `status`
- compound on `subcategoryId`, `status`
- compound on `isFeatured`, `priority`
- compound on `isTrending`, `priority`
- compound on `showOnHomepage`, `priority`
- compound on `status`, `sortOrder`

### 8) `productMedia`
Product images and downloadable files.
- `_id`
- `productId` string ref `products._id`
- `type` enum `image|pdf|tds|brochure|msds|certificate`
- `url` string
- `filename` string|null
- `mimeType` string|null
- `sizeBytes` number|null
- `altText` string|null
- `caption` string|null
- `isPrimary` boolean default false
- `sortOrder` number default 0
- `versionLabel` string|null
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

**Indexes**
- compound on `productId`, `type`, `sortOrder`

### 9) `productSpecGroups`
Optional grouping for technical specs.
- `_id`
- `productId` string ref `products._id`
- `name` string
- `sortOrder` number default 0
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

### 10) `productSpecifications`
Structured technical spec rows.
- `_id`
- `productId` string ref `products._id`
- `specGroupId` string|null ref `productSpecGroups._id`
- `label` string
- `value` string
- `unit` string|null
- `notes` string|null
- `dataType` string default `text`
- `sortOrder` number default 0
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

**Indexes**
- compound on `productId`, `sortOrder`
- compound on `specGroupId`, `sortOrder`

### 11) `productAttributes`
Flexible filterable attributes.
- `_id`
- `productId` string ref `products._id`
- `attributeKey` string
- `attributeLabel` string
- `attributeValue` string
- `dataType` string default `text`
- `isFilterable` boolean default false
- `sortOrder` number default 0
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

### 12) Embedded arrays inside `products`
For highly related content, store arrays directly in the product document when it reduces query complexity.
- `applications` array of refs or slugs
- `industries` array of refs or slugs
- `tags` array of refs or slugs
- `benefits` array of strings
- `features` array of strings
- `usageInstructions` array of strings
- `relatedProductIds` array of strings

### 13) `inquiries`
Inquiry capture.
- `_id`
- `productId` string|null
- `categoryId` string|null
- `name` string
- `email` string|null
- `phone` string
- `companyName` string|null
- `message` string
- `sourcePage` string|null
- `status` string enum `new|contacted|qualified|closed`
- `assignedTo` string|null
- `deletedAt` ISODate|null
- `createdAt` ISODate
- `updatedAt` ISODate

## API Contracts

### Public APIs

#### `GET /api/public/catalog`
Returns categories + published products + counts.

#### `GET /api/public/products`
Query params:
- `q`
- `categorySlug`
- `subcategorySlug`
- `industrySlug`
- `applicationSlug`
- `tagSlug`
- `chemicalType`
- `featured=true`
- `trending=true`
- `page`
- `limit`
- `sort`

#### `GET /api/public/products/:slug`
Returns full product detail including media, files, specs, SEO, and related products.

#### `GET /api/public/categories`
Returns category tree with product counts.

#### `GET /api/public/categories/:slug/products`
Returns products under one category.

#### `POST /api/public/enquiries`
Captures product inquiry.

### Admin APIs

#### `GET /api/products`
Admin list with filters and pagination.

#### `POST /api/products`
Create product.

#### `PUT /api/products/:id`
Update product.

#### `PATCH /api/products/:id/status`
Update status.

#### `PATCH /api/products/:id/feature`
Toggle featured/trending/homepage flags.

#### `DELETE /api/products/:id`
Soft delete product.

#### `POST /api/products/bulk-import`
CSV/JSON import.

#### `POST /api/products/bulk-export`
Export filtered products.

#### `POST /api/categories`
#### `PUT /api/categories/:id`
#### `DELETE /api/categories/:id`

#### `POST /api/subcategories`
#### `PUT /api/subcategories/:id`
#### `DELETE /api/subcategories/:id`

#### `POST /api/uploads/sign`
Signed upload target for images/PDFs.

#### `GET /api/inquiries`
#### `PUT /api/inquiries/:id`

### Validation Rules
- Required: `name`, `slug`, `sku`, `categoryId`, `status`.
- `slug` must be URL-safe and unique.
- `sku` must be unique.
- Media uploads must be validated by MIME type and size.
- Only admins can mutate catalog data.
- Soft delete instead of hard delete.

## Migration Mapping From Current Mongo Fields
- `name` -> `products.name`
- `slug` -> `products.slug`
- `code` -> `products.sku`
- `category_id` -> `products.categoryId`
- `image` -> `products.primaryImage` + `productMedia`
- `gallery_images` -> `productMedia`
- `brochure_pdf`, `tds_pdf`, `msds_pdf`, `certificate` -> `productMedia`
- `seo_title`, `seo_description`, `seo_keywords`, `canonical_url`, `og_image` -> `seo_meta`
- `specification_rows` -> `productSpecifications`
- `application_rows`, `industries_served` -> `products.applications`, `products.industries`, or lookup collections depending on final form

## Rollout Notes
1. Seed categories, industries, applications, and tags first.
2. Backfill product documents and media.
3. Switch public catalog reads to the new schema.
4. Switch admin writes after parity is verified.
5. Keep the old product payload path as fallback until validation is complete.

## Immediate Next Build
- MongoDB schema/validation layer.
- API route contracts.
- Product editor form structure.
- Public products page data contract.
