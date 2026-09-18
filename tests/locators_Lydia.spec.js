// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 01 -- LOCATORS: how you tell Playwright which element you mean.
 *
 * A Locator is a lazy description of an element, not the element itself.
 * Nothing is looked up until you act (click, fill) or assert on it, which is
 * why locators survive re-renders that would break a captured element handle.
 *
 * Preference order, best first:
 *   1. getByRole      -- how assistive tech sees the page; survives restyling
 *   2. getByLabel / getByPlaceholder / getByText -- user-visible anchors
 *   3. getByTestId    -- an explicit contract with the developers
 *   4. CSS / XPath    -- last resort, breaks when markup is refactored
 *
 * Docs: https://playwright.dev/docs/locators
 */


test.describe('Lydia practice tests', () => {


  test.beforeEach(async ({ page }) => {
    await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
  });

  test('signup test', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();




  })


})








//await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
//await page.getByRole('checkbox', { name: 'Subscribe' }).check();
//await page.getByRole('button', { name: /submit/i }).click();








});

