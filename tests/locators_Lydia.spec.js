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
    const signupButton_locator = page.getByRole('button', { name: 'Sign up' });
    const firstName_locator = page.getByRole('textbox', { name: 'First Name'}); 
    const lastName_locator = page.getByRole('textbox', {name: 'Last Name'}); 
    const email_locator = page.getByRole('textbox', {name: 'Email'}); 
    const password_locator = page.getByRole('textbox', {name: 'Password'}); 
    const submitButton_locator = page.getByRole('button', {name: 'Submit'});



    await expect(page).toHaveTitle('Contact List App');
    await expect(signupButton_locator).toBeVisible();
    await signupButton_locator.click();
    await expect(page).toHaveTitle('Add User');
    await firstName_locator.fill ('Ronald');
    await lastName_locator.fill ('Smith');
    await email_locator.fill ('rsmith@test.com');
    await password_locator.fill ('GoodStuff007');
    await submitButton_locator.click();
    //await expect((/** @type {{ status: () => number; }} */ Response) => Response.status() === 201);
   

  });



  
  test('login test', async ({ page }) => {
    const testSiteURL = 'https://thinking-tester-contact-list.herokuapp.com/';
    const userEmail_locator = page.getByRole('textbox', {name:'Email'});
    const userPassowrd_locator = page.getByRole('textbox', {name:'Password'});
    const submitButton_locator = page.getByRole('button', {name:'Submit'});
    const logoutButton_locator = page.getByText('Logout');
    const addNewContactButton_locator = page.getByText('Add a New Contact');
  


    await expect(page).toHaveTitle('Contact List App');
    await expect(page).toHaveURL(testSiteURL);
    await expect(userEmail_locator).toBeVisible();
    await userEmail_locator.fill('rsmith@test.com');
    await expect(userPassowrd_locator).toBeVisible();
    await userPassowrd_locator.fill('GoodStuff007');
    await expect(submitButton_locator).toBeVisible(); 
    await submitButton_locator.click(); 
    await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
    await expect(logoutButton_locator).toBeVisible(); //to get this, go inspect > accessability
    await expect(page.getByText('Contact List')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible(); //we don't always get roles in accessability tab, so then we use another type of locator, 
    await expect(addNewContactButton_locator).toBeVisible();
    await expect (page.locator('id=logout')).toBeVisible();
    await expect (page.locator('id=add-contact')).toBeVisible(); 
    await page.locator('id=logout').click();

  
    //const response = await page.request.get('https://thinking-tester-contact-list.herokuapp.com/users/login');
   //await expect(response).toBeOK();
   //console.log(response.status());

  });


// getting by ID
     // await page.locator("id=Logout").click();
     //await page.locator("#Logout").click();


 test('adding new contacts', async ({ page}) => {
    await expect(page).toHaveTitle('Contact List App');
    await page.getByRole('button', {name: 'Add a New Contact'}).click();
    await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contacts/add');
    await page.getByRole('textbox', { name: 'First Name:'}).fill ('Samantha');
    await page.getByRole ('textbox', { name: 'Last Name:'}).fill ('Dirr');
    await page.getByRole ('textbox', { name: 'Date of Birth:'}).fill ('1990-01-12'); 
    await page.getByRole('textbox', { name: 'Email' }).fill('rsmith@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('GoodStuff007');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Add a New Contact'}).click();
    await page.getByRole('textbox', { name: 'First Name:'}).fill ('Samantha');
    await page.getByRole ('textbox', { name: 'Last Name:'}).fill ('Dirr');
    await page.getByRole ('textbox', { name: 'Date of Birth:'}).fill ('1990-01-12'); 
    await page.getByRole ('textbox', { name: 'Email:'}).fill ('sdirr@testers.com');
    await page.getByRole ('textbox', { name: 'Phone:'}).fill ('0820874464');
    await page.getByRole ('textbox', { name: 'Street Address 1:'}).fill ('702 Bates Road');
    await page.getByRole ('textbox', { name: 'Street Address 2:'}).fill ('Moreletapark');
    await page.getByRole ('textbox', { name: 'City:'}).fill ('Pretoria'); 
    await page.getByRole ('textbox', { name: 'State or Province:'}).fill ('Gautent'); 
    await page.getByRole ('textbox', { name: 'Postal Code:'}).fill ('0182');
    await page.getByRole ('textbox', { name: 'Country:'}).fill ('Wonderland');
    await page.getByRole ('button', { name: 'Submit'}).click();


 });

page
 







//await page.getByRole('button', { name: /submit/i }).click();

});






