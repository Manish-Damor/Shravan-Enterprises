// Lightweight E2E integration test for product API and auth
// Usage: node tools/e2e-integration-test.mjs

const API_BASE = process.env.API_BASE || 'http://localhost:8082';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'princesavaliya039@gmail.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Password123!';

async function run() {
  console.log('Starting E2E integration test against', API_BASE);

  const loginRes = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD }) });
  if (!loginRes.ok) throw new Error('Login failed: ' + await loginRes.text());
  const login = await loginRes.json();
  const token = login.token;
  console.log('Logged in as', login.user.email);

  // create product
  const createRes = await fetch(`${API_BASE}/api/products`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ name: 'E2E Test Product', slug: 'e2e-test-product-' + Date.now(), status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }) });
  if (!createRes.ok) throw new Error('Create product failed: ' + await createRes.text());
  const created = await createRes.json();
  console.log('Created product id', created.id);

  const readRes = await fetch(`${API_BASE}/api/public/products?q=e2e-test-product`, { method: 'GET' });
  if (!readRes.ok) throw new Error('Read public products failed: ' + await readRes.text());
  const list = await readRes.json();
  console.log('Public search returned', list.total, 'items');

  const updateRes = await fetch(`${API_BASE}/api/products/${created.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ short_description: 'Updated by E2E test' }) });
  if (!updateRes.ok) throw new Error('Update failed: ' + await updateRes.text());
  console.log('Updated product', created.id);

  const deleteRes = await fetch(`${API_BASE}/api/products/${created.id}`, { method: 'DELETE', headers: { authorization: 'Bearer ' + token } });
  if (!deleteRes.ok) throw new Error('Delete failed: ' + await deleteRes.text());
  console.log('Deleted product', created.id);

  console.log('E2E integration test passed');
}

run().catch((err) => { console.error(err); process.exit(1); });
