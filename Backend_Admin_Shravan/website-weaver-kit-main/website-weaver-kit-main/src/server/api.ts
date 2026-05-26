import { ObjectId } from "mongodb";
import { getMongoCollections } from "@/integrations/mongo/client.server";
import { hashPassword, comparePassword, createAuthToken, verifyAuthToken } from "@/integrations/mongo/auth";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ message }, status);
}

type CollectionName =
  | "categories"
  | "products"
  | "enquiries"
  | "website_settings"
  | "banners"
  | "clients"
  | "generated_pdfs";

function routeBaseForCollection(collectionName: CollectionName) {
  if (collectionName === "website_settings") return "website-settings";
  if (collectionName === "generated_pdfs") return "generated-pdfs";
  return collectionName;
}

function serializeDocument<T extends Record<string, unknown>>(document: T & { _id?: ObjectId }) {
  const { _id, ...rest } = document;
  return { id: _id?.toString(), ...rest };
}

function parseBool(value: string | null) {
  if (value === null) return undefined;
  return value === "true" || value === "1";
}

function buildQuery(collectionName: CollectionName, url: URL) {
  const query: Record<string, unknown> = {};

  if (collectionName === "enquiries") {
    const status = url.searchParams.get("status");
    if (status && status !== "all") query.status = status;
  }

  if (collectionName === "categories") {
    const visible = parseBool(url.searchParams.get("visible"));
    if (visible !== undefined) query.is_visible = visible;
    const parentId = url.searchParams.get("parent_id");
    if (parentId) query.parent_id = parentId;
  }

  if (collectionName === "products") {
    const status = url.searchParams.get("status");
    if (status && status !== "all") query.status = status;
    const featured = parseBool(url.searchParams.get("featured"));
    if (featured !== undefined) query.featured = featured;
    const categoryId = url.searchParams.get("category_id");
    if (categoryId && categoryId !== "all") query.category_id = categoryId;
    const published = parseBool(url.searchParams.get("published"));
    if (published !== undefined) query.status = published ? "published" : "draft";
  }

  return query;
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

async function requireUser(request: Request) {
  const token = getBearerToken(request);
  if (!token) throw new Error("Unauthorized");

  const payload = await verifyAuthToken(token);
  if (!payload || typeof payload.sub !== "string") throw new Error("Unauthorized");

  const { users } = await getMongoCollections();
  const user = await users.findOne({ _id: new ObjectId(payload.sub) });
  if (!user) throw new Error("Unauthorized");
  return user;
}

async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}

function normalizeIdentifier(value: string) {
  const trimmed = value.trim();
  const phone = trimmed.replace(/[^0-9+]/g, "");
  if (/^\+?[0-9]{6,}$/.test(phone)) {
    return { phone };
  }
  return { email: trimmed.toLowerCase() };
}

export async function handleApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "");

  try {
    if (pathname.startsWith("/api/auth")) {
      return await handleAuthRoutes(request, pathname);
    }

    if (pathname === "/api/users" && request.method === "GET") {
      const user = await requireAdmin(request);
      const { users } = await getMongoCollections();
      const list = await users
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      return jsonResponse(list.map((item) => ({
        id: item._id.toString(),
        email: item.email,
        phone: item.phone,
        role: item.role,
        permissions: item.permissions ?? [],
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      })));
    }

    if (pathname.startsWith("/api/users/") && request.method === "PATCH") {
      await requireAdmin(request);
      const { users } = await getMongoCollections();
      const id = pathname.split("/").pop();
      if (!id) return errorResponse("Not found", 404);
      const body = await request.json();
      const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
      if (body.role) updates.role = String(body.role);
      if (body.permissions) updates.permissions = Array.isArray(body.permissions) ? body.permissions : [];
      const result = await users.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: "after" });
      if (!result) return errorResponse("User not found", 404);
      return jsonResponse({
        id: result._id.toString(),
        email: result.email,
        phone: result.phone,
        role: result.role,
        permissions: result.permissions ?? [],
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    }

    if (pathname.startsWith("/api/categories")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "categories");
    }

    if (pathname.startsWith("/api/products")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "products");
    }

    if (pathname.startsWith("/api/enquiries")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "enquiries");
    }

    if (pathname.startsWith("/api/website-settings")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "website_settings");
    }

    if (pathname.startsWith("/api/banners")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "banners");
    }

    if (pathname.startsWith("/api/clients")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "clients");
    }

    if (pathname.startsWith("/api/generated-pdfs")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "generated_pdfs");
    }

    return errorResponse("Not found", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return errorResponse(message, status);
  }
}

async function handleAuthRoutes(request: Request, pathname: string) {
  const { users } = await getMongoCollections();

  if (pathname === "/api/auth/register" && request.method === "POST") {
    const body = await request.json();
    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");

    if (!identifier || password.length < 6) {
      return errorResponse("Identifier and password are required. Password must be at least 6 characters.");
    }

    const normalized = normalizeIdentifier(identifier);
    const query: Record<string, unknown> = {};
    if (normalized.email) query.email = normalized.email;
    if (normalized.phone) query.phone = normalized.phone;

    const existing = await users.findOne({ $or: [{ email: query.email ?? null }, { phone: query.phone ?? null }] });
    if (existing) {
      return errorResponse("An account with that identifier already exists.");
    }

    const adminCount = await users.countDocuments({ role: "admin" });
    const role = adminCount === 0 ? "admin" : "user";
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const result = await users.insertOne({
      email: normalized.email ?? null,
      phone: normalized.phone ?? null,
      passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    });

    const id = result.insertedId.toString();
    const token = await createAuthToken({ sub: id, role, email: normalized.email, phone: normalized.phone });

    return jsonResponse({
      token,
      user: { id, email: normalized.email ?? null, phone: normalized.phone ?? null, role, created_at: now, updated_at: now },
    });
  }

  if (pathname === "/api/auth/login" && request.method === "POST") {
    const body = await request.json();
    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");

    if (!identifier || !password) {
      return errorResponse("Identifier and password are required.");
    }

    const normalized = normalizeIdentifier(identifier);
    const query: Record<string, unknown> = {};
    if (normalized.email) query.email = normalized.email;
    if (normalized.phone) query.phone = normalized.phone;

    const user = await users.findOne(query);
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return errorResponse("Invalid email/phone or password.");
    }

    const token = await createAuthToken({ sub: user._id.toString(), role: user.role, email: user.email, phone: user.phone });
    return jsonResponse({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });
  }

  if (pathname === "/api/auth/me" && request.method === "GET") {
    const user = await requireUser(request);
    return jsonResponse({
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });
  }

  if (pathname === "/api/auth/account" && request.method === "PATCH") {
    const user = await requireUser(request);
    const body = await request.json();

    const email = body.email ? String(body.email).trim().toLowerCase() : user.email;
    const phone = body.phone ? String(body.phone).trim().replace(/[^0-9+]/g, "") : user.phone;
    const password = body.password ? String(body.password) : undefined;
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (email && email !== user.email) {
      const existing = await users.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return errorResponse("That email address is already in use.");
      }
      updates.email = email;
    }

    if (phone && phone !== user.phone) {
      const existing = await users.findOne({ phone });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return errorResponse("That phone number is already in use.");
      }
      updates.phone = phone;
    }

    if (password) {
      if (password.length < 6) {
        return errorResponse("Password must be at least 6 characters.");
      }
      updates.passwordHash = await hashPassword(password);
    }

    const updatedUser = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { returnDocument: "after" });
    if (!updatedUser) {
      return errorResponse("Unable to update account.");
    }

    return jsonResponse({
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      created_at: updatedUser.createdAt,
      updated_at: updatedUser.updatedAt,
    });
  }

  return errorResponse("Not found", 404);
}

async function handleCollectionRoutes(request: Request, pathname: string, collectionName: CollectionName) {
  const collections = await getMongoCollections();
  const collection = collections[collectionName];
  const routeBase = routeBaseForCollection(collectionName);
  const idMatch = pathname.match(new RegExp(`^/api/${routeBase}/([^/]+)$`));
  const url = new URL(request.url);

  if (request.method === "GET" && pathname === `/api/${routeBase}/count`) {
    const query = buildQuery(collectionName, url);
    const count = await collection.countDocuments(query);
    return jsonResponse({ count });
  }

  if (request.method === "GET" && pathname === `/api/${routeBase}`) {
    const query = buildQuery(collectionName, url);
    const limit = Number(url.searchParams.get("limit")) || undefined;
    let cursor = collection.find(query).sort({ createdAt: -1 });
    if (limit && limit > 0) cursor = cursor.limit(limit);
    const items = await cursor.toArray();
    return jsonResponse(items.map((item) => serializeDocument(item)));
  }

  if (request.method === "POST" && pathname === `/api/${routeBase}`) {
    const body = await request.json();
    const now = new Date().toISOString();
    const payload = { ...body, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(payload);
    return jsonResponse({ id: result.insertedId.toString(), ...payload });
  }

  if ((request.method === "PUT" || request.method === "PATCH") && idMatch) {
    const id = idMatch[1];
    const body = await request.json();
    const update = { ...body, updatedAt: new Date().toISOString() };
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) return errorResponse("Item not found", 404);
    return jsonResponse(serializeDocument(result));
  }

  if (request.method === "DELETE" && idMatch) {
    const id = idMatch[1];
    await collection.deleteOne({ _id: new ObjectId(id) });
    return jsonResponse({ success: true });
  }

  return errorResponse("Not found", 404);
}
