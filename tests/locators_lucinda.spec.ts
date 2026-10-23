// @ts-check
import { test, expect } from "@playwright/test";
import {Page}  from "@playwright/test"


async function login (page: Page){

  const emailaddress = "builder111@gmail.com";
  const password = "bob123123";

        const loginEmail = page.getByRole("textbox", { name: "Email" });
        const loginPassword = page.getByRole("textbox", { name: "Password" });
        const submitLoginButton = page.getByRole("button", { name: "Submit" });

    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await loginEmail.fill(emailaddress);
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(emailaddress);
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await loginPassword.fill(password);
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await submitLoginButton.click();
}

async function logout (page:Page){

await expect(page.getByRole ("button", {name: "Logout"})).toBeVisible();
await page.getByRole("button", {name: "Logout"}).click();
await expect(page.getByText("Contact List")).toBeVisible();
}


async function addContact (page:Page) {

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
    await contactcountry.fill(addcontactcountry);
    await submitcontactbutton.click();

}

async function signup (page:Page){

  const emailaddress = "builder111@gmail.com";
  const firstName = "Bob";
  const lastName = "The Builder";
  const password = "bob123123";

    const signupEmailAddress = `builder${Date.now()}@gmail.com`;
    const submitSignupButton = page.getByRole("button", { name: "Submit" });
    const signupButton = page.getByRole("button", { name: "Sign up" });
    const signupFirstName = page.getByRole("textbox", { name: "First Name" });
    const signupLastName = page.getByRole("textbox", { name: "Last Name" });
    const signupEmail = page.getByRole("textbox", { name: "Email" });
    const signupPassword = page.getByRole("textbox", { name: "Password" });

    await signupButton.click();
    await signupFirstName.fill(firstName);
    await signupLastName.fill(lastName);
    await signupEmail.fill(signupEmailAddress);
    await signupPassword.fill(password);
    await submitSignupButton.click();

}



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



  const landingPageURL = "https://thinking-tester-contact-list.herokuapp.com/";

  test.beforeEach(async ({ page }) => {
    await page.goto(landingPageURL);
  });

  test("Sign-up test", async ({ page }) => {

    await expect(page.getByRole ("heading", {name:"Contact List App"})).toBeVisible();
    await signup(page);
    await expect (page.getByRole("heading", {name:"Contact List"})).toBeVisible();
    await logout(page);
    await expect(page.getByRole ("heading", {name: "Contact List App"})).toBeVisible();
  });


  test("login test", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Contact List")).toBeVisible();
    await expect(page.getByText("Logout")).toBeVisible();
    await expect(page.getByText("Click on any contact to view the Contact Details"),).toBeVisible();
    await expect(page.locator("#add-contact")).toBeVisible();
    await expect(page.getByText("Created by Kristin Jackvony, Copyright 2021 "),).toBeVisible();
    await logout(page);
    await expect(page.getByRole ("heading", {name: "Contact List App"})).toBeVisible();
  });

  test("Add new contact", async ({ page }) => {
    //login to page first

await login(page);
await expect(page.getByRole("heading", { name: "Contact List" }),).toBeVisible();
await page.getByRole ("button", {name:"Add a New Contact"}).click();
await expect(page.getByRole("heading", {name:"Add Contact" })).toBeVisible();
await addContact(page);
await expect (page.locator ("#myTable")).toBeVisible();
await expect(page.getByRole('cell', { name: 'Lucinda van der Merwe' }).nth(0)).toBeVisible();
await logout(page);

  });




//#endregion
// Creating a different type of add contact
// This is called parameterization, where you can pass in different values to the function to create different contacts. 
// This is useful for testing with multiple data sets.

async function addContactParameterized (page:Page, addcontactfirstname:string, addcontactlastname:string, addcontactdob:string,
addcontactemail:string, addcontactphone:string, addcontactstreetaddress1:string, addcontactstreetaddress2:string, addcontactcity:string, 
addcontactstateorprovince:string, addcontactpostalcode:string, addcontactcountry:string) {

  const contactfirstname_locator=page.getByRole("textbox", { name: "First Name:" });
  const contactlastname_locator=page.getByRole("textbox", { name: "Last Name:" });  
  const contactdob_locator = page.getByRole("textbox", { name: "Date of Birth:" });
  const contactemail_locator = page.getByRole("textbox", { name: "Email:" });
  const contactphone_locator = page.getByRole("textbox", { name: "Phone:" });
  const contactstreetaddress1_locator = page.getByRole("textbox", { name: "Street Address 1:" });
  const contactstreetaddress2_locator = page.getByRole("textbox", { name: "Street Address 2:" });
  const contactcity_locator = page.getByRole("textbox", { name: "City:" });
  const contactstateorprovince_locator = page.getByRole("textbox", { name: "State or Province:" });
  const contactpostalcode_locator = page.getByRole("textbox", { name: "Postal Code:" });
  const contactcountry_locator = page.getByRole("textbox", { name: "Country:" });
  const submitcontactbutton_locator = page.getByRole("button",{name:"Submit"});

await page.getByRole ("button", {name:"Add a New Contact"}).click();
await expect(page.getByRole("heading", {name:"Add Contact" })).toBeVisible();
  await contactfirstname_locator.fill(addcontactfirstname);
    await contactlastname_locator.fill(addcontactlastname);
    await contactdob_locator.fill(addcontactdob);
    await contactemail_locator.fill(addcontactemail);
    await contactphone_locator.fill(addcontactphone);
    await contactstreetaddress1_locator.fill(addcontactstreetaddress1);
    await contactstreetaddress2_locator.fill(addcontactstreetaddress2);
    await contactcity_locator.fill(addcontactcity);
    await contactstateorprovince_locator.fill(addcontactstateorprovince);
    await contactpostalcode_locator.fill(addcontactpostalcode);
    await contactcountry_locator.fill(addcontactcountry);
    await submitcontactbutton_locator.click();
}

 test("Add new contact Multiple users ", async ({ page }) => {
    //login to page first

await login(page);
await expect(page.getByRole("heading", { name: "Contact List" }),).toBeVisible();

await addContactParameterized(page,"Bob","The Builder", "1990-10-08","bobsemail@testmail.com","0827741445","11 Heskwas Avenue","ErasmuskloofRidge","Pretoria","Gauteng","0048","South Africa");
await addContactParameterized(page, "Sandy","The Bird", "1995-10-08","sandybird@testmail.com","0827741446","12 Heskwas Avenue","ErasmuskloofRidge","Pretoria","Gauteng","0048","South Africa");
await addContactParameterized(page, "Lucinda","van der Merwe", "2000-11-01","lucindavandermerwe@testmail.com","0827741447","13 Heskwas Avenue","ErasmuskloofRidge","Pretoria","Gauteng","0048","South Africa");
await addContactParameterized(page, "John","Doe", "1985-10-08","johndoe@testmail.com","0827741448","14 Heskwas Avenue","ErasmuskloofRidge","Pretoria","Gauteng","0048","South Africa");


await expect (page.locator ("#myTable")).toBeVisible();
await expect(page.getByRole('cell', { name: 'Lucinda van der Merwe' }).nth(0)).toBeVisible();
await logout(page);


  });

async function loginParameterized (page:Page, emailaddress:string, password:string){

const loginEmail_locator = page.getByRole("textbox", { name: "Email" });
        const loginPassword_locator = page.getByRole("textbox", { name: "Password" });
        const submitLoginButton_locator = page.getByRole("button", { name: "Submit" });

  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await loginEmail_locator.fill(emailaddress);
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(emailaddress);
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await loginPassword_locator.fill(password);
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await submitLoginButton_locator.click();

}

  test("login test failure", async ({ page }) => {

    await expect(page.getByRole ("heading", {name: "Contact List App"})).toBeVisible();
    await loginParameterized(page,"fakeemailforlogin@testmail.com","fakepassword");
    await expect(page.locator("#error")).toBeVisible();
  });


  // Here we are going to create a method to cover both positive (Successful Login) and negative (Failed Login) scenarios. 
  // We are adding a default value in the parameters to check for failures
async function passloginandfailParameterized (page:Page, emailaddress:string, password:string, isValid:boolean= true){

const loginEmail_locator = page.getByRole("textbox", { name: "Email" });
const loginPassword_locator = page.getByRole("textbox", { name: "Password" });
const submitLoginButton_locator = page.getByRole("button", { name: "Submit" });


    if (isValid===true){
       await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await loginEmail_locator.fill(emailaddress);
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(emailaddress);
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await loginPassword_locator.fill(password);
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await submitLoginButton_locator.click();
    await expect(page.getByRole ("heading", { name: "Contact List" })).toBeVisible();

    } else {
      
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await loginEmail_locator.fill(emailaddress);
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(emailaddress);
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await loginPassword_locator.fill(password);
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await submitLoginButton_locator.click();
    await expect(page.locator("#error")).toBeVisible();
    }

}

  test("login test Pass and failure", async ({ page }) => {

    await expect(page.getByRole ("heading", {name: "Contact List App"})).toBeVisible();
    await passloginandfailParameterized(page,"fakeemailforlogin@testmail.com","fakepassword", false);
    await passloginandfailParameterized(page,"builder111@gmail.com","bob123123");

  });

});
