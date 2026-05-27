// Quick E2E script: login, create category, create product, verify public catalog
(async () => {
  try {
    const base = process.env.BACKEND_BASE || 'http://localhost:8082';
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'princesavaliya039@gmail.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Password123!';

    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: adminEmail, password: adminPassword }),
    });
    console.log('login status', loginRes.status);
    const loginJson = await loginRes.json();
    if (!loginRes.ok) { console.error('login failed', loginJson); process.exit(1); }
    const token = loginJson.token;
    console.log('token', token ? token.slice(0, 24) + '...' : 'none');

    const categoryPayload = {
      name: 'Test Category AI',
      slug: 'test-category-ai',
      short_description: 'Temporary category created by automated check',
      status: 'active',
      is_visible: true,
      sort_order: 999,
    };

    const createCat = await fetch(`${base}/api/categories`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify(categoryPayload),
    });
    console.log('create category status', createCat.status);
    const catJson = await createCat.json();
    console.log('created category id', catJson.id || JSON.stringify(catJson));

    const productPayload = {
      name: 'Test Product AI',
      slug: 'test-product-ai',
      category_id: catJson.id,
      short_description: 'Temporary product for E2E check',
      detailed_description: 'Created by automated e2e script',
      status: 'published',
      featured: false,
      sort_order: 999,
    };

    const createProd = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify(productPayload),
    });
    console.log('create product status', createProd.status);
    const prodJson = await createProd.json();
    console.log('created product id', prodJson.id || JSON.stringify(prodJson));

    const catalogRes = await fetch(`${base}/api/public/catalog`);
    console.log('catalog status', catalogRes.status);
    const catalogJson = await catalogRes.json();
    console.log('counts', catalogJson.counts);
    const foundCat = (catalogJson.categories || []).find((c) => c.slug === 'test-category-ai');
    const foundProd = (catalogJson.products || []).find((p) => p.slug === 'test-product-ai');
    console.log('foundCategory', !!foundCat);
    console.log('foundProduct', !!foundProd);

    if (foundCat) console.log('Category visible title:', foundCat.title);
    if (foundProd) console.log('Product visible name:', foundProd.name);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
