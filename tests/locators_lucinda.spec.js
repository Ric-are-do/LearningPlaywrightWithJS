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

test.describe("lucindapracticetest", () => {
let emailaddress= "builder111@gmail.com";
let firstName= "Bob";
let lastName= "The Builder";
let password= "bob123123";

let addcontactfirstname= "Lucinda";
let addcontactlastname= "van der Merwe";
let addcontactdob= "2000-11-01";
let addcontactemail="testmail@testmail.com";
let addcontactphone= "0827741444";
let addcontactstreetaddress1= "1 Heskwas Avenue";
let addcontactstreetaddress2= "Erasmuskloof";
let addcontactcity= "Pretoria";
let addcontactstateorprovince= "Gauteng";
let addcontactpostalcode= "0047";
let addcontactcountry= "South Africa";

  test.beforeEach(async ({ page }) => {
    await page.goto("https://thinking-tester-contact-list.herokuapp.com/");
  });

  
  test("Sign-up test", async ({ page }) => {
   const submitSignupButton = page.getByRole("button",{name: "Submit"});
   const signupButton = page.getByRole ("button", {name: "Sign up"});
   const signupFirstName= page.getByRole("textbox",{name:"First Name"});
   const signupLastName=page.getByRole("textbox",{name:"Last Name"})
   const signupEmail= page.getByRole("textbox", {name: "Email"});
   const signupPassword= page.getByRole("textbox", {name: "Password"});
    await signupButton.click();
    await signupFirstName.fill(firstName);
    await signupLastName.fill(lastName);
    await signupEmail.fill(emailaddress);
    await signupPassword.fill(password);
    await submitSignupButton.click();
  });

  test.describe("Login Test + Adding new contact", () => {
    test("login test", async ({ page }) => {

      await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
      await page.getByRole("textbox", { name: "Email" }).fill(emailaddress);
      await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(emailaddress);
      await expect(page.getByRole("textbox", { name: "Password" }),).toBeVisible();
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByText("Contact List")).toBeVisible();
      await expect(page.getByText("Logout")).toBeVisible();
      await expect(page.getByText("Click on any contact to view the Contact Details"),).toBeVisible();
      await expect(page.locator("#add-contact")).toBeVisible();
      await expect(page.getByText("Created by Kristin Jackvony, Copyright 2021 "),).toBeVisible();
      await page.locator("#logout").click();

    });

    test("Add new contact", async ({ page }) => {
      //login to page first
      await page.getByRole("textbox", { name: "Email" }).fill(emailaddress);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByRole("heading", { name: "Contact List" }),).toBeVisible();

      //Add Contact Page should have loaded after login

      await page.getByRole("textbox", { name: "First Name:" }).fill(addcontactfirstname);
      await page.getByRole("textbox", { name: "Last Name:" }).fill(addcontactlastname);
      await page.getByRole("textbox", { name: "Date of Birth:" }).fill(addcontactdob);
      await page.getByRole("textbox", { name: "Email:" }).fill(addcontactemail);
      await page.getByRole("textbox", { name: "Phone:" }).fill(addcontactphone);
      await page.getByRole("textbox", { name: "Street Address 1:" }).fill(addcontactstreetaddress1);
      await page.getByRole("textbox", { name: "Street Address 2:" }).fill(addcontactstreetaddress2);
      await page.getByRole("textbox", { name: "City:" }).fill(addcontactcity);
      await page.getByRole("textbox", { name: "State or Province:" }).fill(addcontactstateorprovince);
      await page.getByRole("textbox", { name: "Postal Code:" }).fill(addcontactpostalcode);
      await page.getByRole("textbox", { name: "Country:" }).fill(addcontactcountry);
      await page.getByRole("button", { name: "Submit" }).click();
    });
  });
});
