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
  const emailaddress = "builder111@gmail.com";
  const firstName = "Bob";
  const lastName = "The Builder";
  const password = "bob123123";

  const addcontactfirstname = "Lucinda";
  const addcontactlastname = "van der Merwe";
  const addcontactdob = "2000-11-01";
  const addcontactemail = "testmail@testmail.com";
  const addcontactphone = "0827741444";
  const addcontactstreetaddress1 = "1 Heskwas Avenue";
  const addcontactstreetaddress2 = "Erasmuskloof";
  const addcontactcity = "Pretoria";
  const addcontactstateorprovince = "Gauteng";
  const addcontactpostalcode = "0047";
  const addcontactcountry = "South Africa";

  const landingPageURL = "https://thinking-tester-contact-list.herokuapp.com/";

  test.beforeEach(async ({ page }) => {
    await page.goto(landingPageURL);
  });

  test("Sign-up test", async ({ page }) => {
    const submitSignupButton = page.getByRole("button", { name: "Submit" });
    const signupButton = page.getByRole("button", { name: "Sign up" });
    const signupFirstName = page.getByRole("textbox", { name: "First Name" });
    const signupLastName = page.getByRole("textbox", { name: "Last Name" });
    const signupEmail = page.getByRole("textbox", { name: "Email" });
    const signupPassword = page.getByRole("textbox", { name: "Password" });

    await signupButton.click();
    await signupFirstName.fill(firstName);
    await signupLastName.fill(lastName);
    await signupEmail.fill(emailaddress);
    await signupPassword.fill(password);
    await submitSignupButton.click();
  });


  test("login test", async ({ page }) => {
        const loginEmail = page.getByRole("textbox", { name: "Email" });
        const loginPassword = page.getByRole("textbox", { name: "Password" });
        const submitLoginButton = page.getByRole("button", { name: "Submit" });

    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await loginEmail.fill(emailaddress);
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(emailaddress, );
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await loginPassword.fill(password);
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await submitLoginButton.click();
    await expect(page.getByText("Contact List")).toBeVisible();
    await expect(page.getByText("Logout")).toBeVisible();
    await expect(page.getByText("Click on any contact to view the Contact Details"),).toBeVisible();
    await expect(page.locator("#add-contact")).toBeVisible();
    await expect(page.getByText("Created by Kristin Jackvony, Copyright 2021 "),).toBeVisible();
    await page.locator("#logout").click();
  });

  test("Add new contact", async ({ page }) => {
    //login to page first

    const loginEmail = page.getByRole("textbox", { name: "Email" });
    const loginPassword = page.getByRole("textbox", { name: "Password" });
    const submitLoginButton = page.getByRole("button", { name: "Submit" });

    await loginEmail.fill(emailaddress);
    await loginPassword.fill(password);
    await submitLoginButton.click();
    await expect(page.getByRole("heading", { name: "Contact List" }),).toBeVisible();

    //Add Contact Page should have loaded after login

  const contactfirstname = page.getByRole("textbox", { name: "First Name:" });
  const contactlastname = page.getByRole("textbox", { name: "Last Name:" });
  const contactdob = page.getByRole("textbox", { name: "Date of Birth:" });
  const contactemail = page.getByRole("textbox", { name: "Email:" });
  const contactphone = page.getByRole("textbox", { name: "Phone:" });
  const contactstreetaddress1 = page.getByRole("textbox", { name: "Street Address 1:" });
  const contactstreetaddress2 = page.getByRole("textbox", { name: "Street Address 2:" });
  const contactcity = page.getByRole("textbox", { name: "City:" });
  const contactstateorprovince = page.getByRole("textbox", { name: "State or Province:" });
  const contactpostalcode = page.getByRole("textbox", { name: "Postal Code:" });
  const contactcountry = page.getByRole("textbox", { name: "Country:" });
  const submitcontactbutton = page.getByRole("button",{name:"Submit"});

    await contactfirstname.fill(addcontactfirstname);
    await contactlastname.fill(addcontactlastname);
    await contactdob.fill(addcontactdob);
    await contactemail.fill(addcontactemail);
    await contactphone.fill(addcontactphone);
    await contactstreetaddress1.fill(addcontactstreetaddress1);
    await contactstreetaddress2.fill(addcontactstreetaddress2);
    await contactcity.fill(addcontactcity);
    await contactstateorprovince.fill(addcontactstateorprovince);
    await contactpostalcode.fill(addcontactpostalcode);
    await contactcountry  .fill(addcontactcountry);
    await submitcontactbutton.click();
  });
});
