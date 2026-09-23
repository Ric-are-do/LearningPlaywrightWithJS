// @ts-check
import { test, expect } from "@playwright/test";

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

test.describe("lucindapraticetest", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://thinking-tester-contact-list.herokuapp.com/");
  });

  test("Sign-up test", async ({ page }) => {
    await page.getByRole("button", { name: "Sign up" }).click();
    await page.getByRole("textbox", { name: "First Name" }).fill("Bob");
    await page.getByRole("textbox", { name: "Last Name" }).fill("The Builder");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("builder111@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("bob123123");
    await page.getByRole("button", { name: "Submit" }).click();
  });


  test.describe("Contact list flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://thinking-tester-contact-list.herokuapp.com/");
  });

    test("login test", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).fill("builder111@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("bob123123");
    await page.getByRole("button", { name: "Submit" }).click();
  })

  test("Add new contact", async ({ page }) => {
    //login to page first 
    await page.getByRole("textbox", { name: "Email" }).fill("builder111@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("bob123123");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByRole("heading", { name: "Contact List" }),).toBeVisible();

    //Add Contact Page should have loaded 

    await page.getByRole('textbox', { name: 'First Name:'}).fill ('Lucinda');
    await page.getByRole ('textbox', { name: 'Last Name:'}).fill ('van der Merwe');
    await page.getByRole ('textbox', { name: 'Date of Birth:'}).fill ('2000-11-01'); 
    await page.getByRole ('textbox', { name: 'Email:'}).fill ('bobtwo@gmail.com');
    await page.getByRole ('textbox', { name: 'Phone:'}).fill ('0827741444');
    await page.getByRole ('textbox', { name: 'Street Address 1:'}).fill ('1 Heskwas Avenue');
    await page.getByRole ('textbox', { name: 'Street Address 2:'}).fill ('Erasmuskloof');
    await page.getByRole ('textbox', { name: 'City:'}).fill ('Pretoria'); 
    await page.getByRole ('textbox', { name: 'State or Province:'}).fill ('Gauteng'); 
    await page.getByRole ('textbox', { name: 'Postal Code:'}).fill ('0047');
    await page.getByRole ('textbox', { name: 'Country:'}).fill ('South Africa');
    await page.getByRole ('button', { name: 'Submit'}).click();

  });
  });
});

