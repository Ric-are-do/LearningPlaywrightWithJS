// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 05 -- API TESTING: HTTP requests with no browser involved.
 *
 * Playwright can drive a REST API directly. Two common uses:
 *   - test the API on its own (this file)
 *   - set up state fast: create your fixtures over HTTP, then assert in the UI.
 *     A login through the API takes ~200ms; the same login through the UI takes
 *     seconds and re-tests the login form in every single test.
 *
 * Target: https://jsonplaceholder.typicode.com -- a free fake REST API. Writes
 * are simulated: it echoes back what you sent with a new id, but stores nothing.
 *
 * Docs: https://playwright.dev/docs/api-testing
 */

const API = 'https://jsonplaceholder.typicode.com';

test.describe('using the built-in request fixture', () => {
  // The `request` fixture inherits baseURL from playwright.config.js -- which
  // points at TodoMVC here -- so these tests pass absolute URLs instead.
  test('GET a single resource', async ({ request }) => {
    const response = await request.get(`${API}/posts/1`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      id: 1,
      userId: expect.any(Number),
      title: expect.any(String),
    }));
  });

  test('GET a collection', async ({ request }) => {
    const response = await request.get(`${API}/posts`);

    expect(response.ok()).toBeTruthy();
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts).toHaveLength(100);
  });

  test('a 404 is a normal response, not a thrown error', async ({ request }) => {
    const response = await request.get(`${API}/posts/99999`);

    // Playwright does not throw on 4xx/5xx -- you assert on the status
    // yourself. Only transport failures (DNS, connection refused) throw.
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(404);
  });
});

test.describe('a dedicated request context with its own baseURL', () => {
  /** @type {import('@playwright/test').APIRequestContext} */
  let api;

  test.beforeAll(async ({ playwright }) => {
    // Building your own context lets you set a baseURL and headers once and
    // share the connection (and any auth cookies) across the whole file.
    api = await playwright.request.newContext({
      baseURL: API,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
  });

  test.afterAll(async () => {
    // Always dispose -- it frees the responses this context is holding.
    await api.dispose();
  });

  test('POST creates a resource', async ({}) => {
    const response = await api.post('/posts', {
      data: { title: 'learning playwright', body: 'day one', userId: 1 },
    });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual(expect.objectContaining({
      title: 'learning playwright',
      body: 'day one',
      userId: 1,
    }));
  });

  test('query parameters', async ({}) => {
    // `params` builds the query string for you, with escaping handled.
    const response = await api.get('/comments', { params: { postId: 1 } });

    expect(response.ok()).toBeTruthy();
    const comments = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
    }
  });
});
