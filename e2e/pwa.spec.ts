import { expect, test } from '@playwright/test';

test.describe('PWA', () => {
  test('loads the application', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.getByTitle('Settings')).toBeVisible();
  });

  test('links a web app manifest', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      'href',
      /manifest\.webmanifest$/
    );
  });

  test('serves a valid manifest', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(href).toBeTruthy();

    const manifestUrl = new URL(href!, page.url()).href;
    const response = await request.get(manifestUrl);
    expect(response.ok()).toBeTruthy();

    const manifest = (await response.json()) as {
      display: string;
      icons: { sizes: string }[];
      name: string;
      short_name: string;
      start_url: string;
    };

    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBeTruthy();

    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });

  test('serves sw.js', async ({ request }) => {
    const response = await request.get('sw.js');
    expect(response.ok()).toBeTruthy();
  });

  test('registers a service worker', async ({ page }) => {
    await page.goto('/');

    await expect
      .poll(
        () =>
          page.evaluate(async () => {
            const registration = await navigator.serviceWorker.getRegistration();
            return (
              registration?.active?.scriptURL ??
              registration?.installing?.scriptURL ??
              registration?.waiting?.scriptURL ??
              null
            );
          }),
        { timeout: 10_000 }
      )
      .toMatch(/sw\.js/);
  });
});
