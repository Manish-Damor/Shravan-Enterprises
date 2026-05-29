# Products Module — Phase 1

## Overview
This doc summarizes the Phase-1 deliverables implemented and next steps.

- Storage: MongoDB (`products`, `categories`, `generated_pdfs`, `user_profiles`).
- Backend: API-only server in `Shravan_Backend/src/server/api.ts`.
- Admin UI: `Admin_Panel` with `MediaDropzone` integrated to upload via `/api/uploads`.
- Public site: `Shravan_FrontEnd` consumes `/api/public/catalog` and `/api/public/products`.

## Product schema (public-facing fields)
- id, slug, name, subtitle
- category_id, category_slug, category_title
- featured (bool), status (published/draft/inactive)
- image, gallery_images, application_images (media objects {url,name,type})
- files: brochure_pdf, tds_pdf, msds_pdf, certificate (media objects)
- short_description, detailed_description, product_details
- key_features, benefits, packaging_details, storage_instructions, safety_notes
- technical_specifications, specification_rows (array)
- applications, industries_served, tags
- seo fields: seo_title, seo_description, seo_keywords, canonical_url, og_image
- metadata: createdAt, updatedAt, sort_order

Notes: Media objects may be stored as `{ url }` for external paths or as base64-backed entries in `generated_pdfs` (dev fallback). Production should migrate to S3/R2 and use presigned uploads.

## Implemented APIs
- GET `/api/public/catalog` — categories + published products (rich product fields for storefront).
- GET `/api/public/products` — paginated public products with `q`, `category`, `tag`, `featured`, `page`, `limit` and basic faceting.
- POST `/api/brochure-enquiry` — saves brochure requests.
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/account`.
- Admin collection routes: CRUD under `/api/products`, `/api/categories`, `/api/enquiries`, etc. Protected with JWT.
- Uploads: POST `/api/uploads` (direct base64 storage for dev), GET `/api/uploads/:id`, POST `/api/uploads/sign` (returns direct strategy instruction for local dev).

## Migration summary
- Script: `tools/migrate-products-to-new-schema.mjs` (also copied to `Shravan_Backend/tools/`).
- Behavior: idempotent in-place updates of `products` documents; normalizes media, arrays, tags, and fills missing fields with defaults.
- Run summary on local dev DB (`website-weaver-kit`): 16 products processed during the run performed.
- Safety: script updates fields via `updateOne({ _id }, { $set: updates })` and preserves `_id`.
- Recommendations: run in a staging environment first; export a backup: `mongodump --uri <URI> -d <db> -o dump/`.

## Upload behavior (dev fallback)
- Admin `MediaDropzone` uploads files to `/api/uploads` as base64 JSON: `{ filename, contentType, data }`.
- Backend stores these into `generated_pdfs` collection (field: `dataBase64`) and returns a retrieval URL `/api/uploads/:id`.
- For production: replace `/api/uploads` implementation with S3/R2 presigned URL flow — keep the `/api/uploads/sign` contract.

## Tests run
- Seed: `tools/seed-local-data.mjs` (created admin `princesavaliya039@gmail.com` and sample categories/products).
- Migration executed: `Shravan_Backend/tools/migrate-products-to-new-schema.mjs`.
- Lightweight E2E: `tools/e2e-integration-test.mjs` — logs in, creates a product, updates it, deletes it (passed).

## Next steps (Phase 1 → Phase 2 brief)
- Replace direct base64 storage with S3/R2 integration and presigned uploads.
- Harden product validation (Zod schema) and enforce slug/sku uniqueness.
- Implement search indexing (Mongo Atlas Search or Elastic) for advanced queries.
- Add integration tests (Playwright/E2E) covering admin flows and file uploads.

---

## QA Checklist (Phase 1)
Run these checks locally and in staging before merging to main.

1) Environment
- Set `MONGODB_URI` to the target DB.
- Start backend: `cd Shravan_Backend && npm run dev` (or run via node entry).
- Start admin: `cd Admin_Panel && npm run dev`.

2) Sanity endpoints
- GET `/api/` or root health route (backend prints a running message if configured).
- GET `/api/public/catalog` should return JSON with categories and products.
- GET `/api/public/products` should return `total` and `products`.

3) Auth & admin
- Run `node tools/seed-local-data.mjs` to ensure admin exists.
- POST `/api/auth/login` with seeded credentials and expect `token` and `user`.
- Use `Authorization: Bearer <token>` to PATCH `/api/products/:id` and expect updated fields.

4) Uploads
- Use `MediaDropzone` in admin to upload an image and a PDF; verify the stored URL references `/api/uploads/:id` or external path.
- GET the returned `/api/uploads/:id` and verify file and content-type are correct.

5) Migration
- Run `node Shravan_Backend/tools/migrate-products-to-new-schema.mjs` on a clone of production DB or staging.
- Verify product documents contain `gallery_images`, `specification_rows`, `tags`, `seo_*` fields.

6) E2E
- Run `node tools/e2e-integration-test.mjs` and expect "E2E integration test passed".

7) Clean-up
- Ensure any temporary base64 entries are moved to proper object storage in production.

---

If you'd like, I can now:
- Prepare a PR with these changes, or
- Implement S3/R2 presigned upload flow next, or
- Expand tests to include file upload flows (Playwright).
