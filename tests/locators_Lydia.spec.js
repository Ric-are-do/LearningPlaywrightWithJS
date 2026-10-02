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
    await expect(page).toHaveTitle('Contact List App');
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveTitle('Add User');
    await page.getByRole('textbox', { name: 'First Name'}).fill ('Ronald');
    await page.getByRole('textbox', {name: 'Last Name'}).fill ('Smith');
    await page.getByRole('textbox', {name: 'Email'}).fill ('rsmith@test.com');
    await page.getByRole('textbox', {name: 'Password'}).fill ('GoodStuff007');
    await page.getByRole('button', {name: 'Submit'}).click();
    await expect((/** @type {{ status: () => number; }} */ Response) => Response.status() === 201);
   

  });



  
  test('login test', async ({ page }) => {
    await expect(page).toHaveTitle('Contact List App');
    await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com');
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Email' }).fill('rsmith@test.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Password' }).fill('GoodStuff007');
    await expect(page.getByRole('button', { name: 'Submit'})).toBeVisible(); 
    await page.getByRole('button', { name: 'Submit'}).click(); 
    const response = await page.request.get('https://thinking-tester-contact-list.herokuapp.com/users/login');
   await expect(response).toBeOK();
   //console.log(response.status());

  });


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


 







//await page.getByRole('button', { name: /submit/i }).click();

});






