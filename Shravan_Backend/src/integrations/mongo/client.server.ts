import { getDb } from "./client";

export async function getMongoCollections() {
  const db = await getDb();
  const userProfiles = db.collection("user_profiles");
  return {
    categories: db.collection("categories"),
    products: db.collection("products"),
    enquiries: db.collection("enquiries"),
    brochure_enquiries: db.collection("brochure_enquiries"),
    user_profiles: userProfiles,
    user_roles: db.collection("user_roles"),
    users: userProfiles,
    website_settings: db.collection("website_settings"),
    banners: db.collection("banners"),
    clients: db.collection("clients"),
    generated_pdfs: db.collection("generated_pdfs"),
  };
}
